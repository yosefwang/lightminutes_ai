import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from '@hono/node-server/serve-static';
import { ulid } from 'ulid';
import { db, eq, desc } from './db/index.js';
import type { Recording, SummaryLanguage } from './db/schema.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transcribeAudio } from './services/groq.js';
import { generateSummary } from './services/llm.js';
import type { SummaryResult } from './services/llm.js';
import { uploadToCloud, deleteFromCloud, listCloudRecordings, isR2Configured } from './services/r2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads/*', serveStatic({ root: path.join(__dirname, '..') }));

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', r2Configured: isR2Configured() });
});

app.post('/api/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const audio = body.audio as File;
    const duration = body.duration ? parseInt(body.duration as string) : null;
    const mimeType = (body.mimeType as string) || audio.type || 'audio/webm';
    const language = (body.language as 'zh' | 'en') || 'zh';

    if (!audio) {
      return c.json({ error: 'No audio file' }, 400);
    }

    // Determine file extension from mime type
    let extension = 'webm';
    if (mimeType.includes('ogg')) extension = 'ogg';
    if (mimeType.includes('mp4') || mimeType.includes('m4a')) extension = 'm4a';
    if (mimeType.includes('mpeg') || mimeType.includes('mp3')) extension = 'mp3';
    if (mimeType.includes('wav')) extension = 'wav';

    const id = ulid();
    const filename = `${id}.${extension}`;
    const filePath = path.join(uploadsDir, filename);
    const relativePath = `/uploads/${filename}`;

    const buffer = Buffer.from(await audio.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const title = language === 'en'
      ? `New Recording ${new Date().toISOString()}`
      : `新录音 ${new Date().toISOString()}`;

    const recording: Recording = {
      id,
      title,
      audioPath: relativePath,
      status: 'processing',
      duration,
      createdAt: Date.now(),
      transcript: null,
      summary: null,
      cloudStatus: 'not_uploaded',
      cloudKey: null,
      cloudUrl: null,
      tags: [],
      summaryLanguage: language,
    };

    await db.recordings.insert(recording);

    return c.json({ id });
  } catch (err) {
    console.error('Upload error:', err);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

app.post('/api/process/:id', async (c) => {
  const id = c.req.param('id');

  (async () => {
    try {
      const [recording] = db.recordings.select().from().where(eq('id', id));
      if (!recording) return;

      const audioPath = path.join(__dirname, '..', recording.audioPath);

      let transcript: string;
      try {
        transcript = await transcribeAudio(audioPath);
      } catch (err) {
        console.error('STT failed:', err);
        transcript = 'Transcription failed. Please configure GROQ_API_KEY.';
      }

      const result: SummaryResult = await generateSummary(transcript, recording.summaryLanguage);

      db.recordings.update().set({
        transcript,
        summary: result.summary,
        status: 'completed',
        tags: result.tags,
      }).where(eq('id', id));
    } catch (err) {
      console.error('Processing error:', err);
      db.recordings.update().set({ status: 'failed' }).where(eq('id', id));
    }
  })();

  return c.json({ success: true, id });
});

app.post('/api/regenerate-summary/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const language = (body.language || 'zh') as SummaryLanguage;
  const promptTemplate = body.promptTemplate as string | undefined;

  try {
    const [recording] = db.recordings.select().from().where(eq('id', id));
    if (!recording) {
      return c.json({ error: 'Not found' }, 404);
    }

    if (!recording.transcript) {
      return c.json({ error: 'No transcript available' }, 400);
    }

    db.recordings.update().set({
      summaryLanguage: language,
      summary: null,
    }).where(eq('id', id));

    (async () => {
      try {
        const result: SummaryResult = await generateSummary(recording.transcript!, language, promptTemplate);
        db.recordings.update().set({
          summary: result.summary,
          tags: result.tags
        }).where(eq('id', id));
      } catch (err) {
        console.error('Regenerate summary failed:', err);
      }
    })();

    return c.json({ success: true });
  } catch (err) {
    console.error('Regenerate summary error:', err);
    return c.json({ error: 'Failed' }, 500);
  }
});

app.get('/api/history', async (c) => {
  const allRecordings = db.recordings.select().from().orderBy(desc('createdAt'));
  return c.json(allRecordings);
});

app.get('/api/recording/:id', async (c) => {
  const id = c.req.param('id');
  const [recording] = db.recordings.select().from().where(eq('id', id));

  if (!recording) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(recording);
});

app.delete('/api/recording/:id', async (c) => {
  const id = c.req.param('id');
  const [recording] = db.recordings.select().from().where(eq('id', id));

  if (!recording) {
    return c.json({ error: 'Not found' }, 404);
  }

  const audioPath = path.join(__dirname, '..', recording.audioPath);
  if (fs.existsSync(audioPath)) {
    fs.unlinkSync(audioPath);
  }

  if (recording.cloudKey && recording.cloudStatus === 'uploaded') {
    try {
      await deleteFromCloud(recording.cloudKey);
    } catch (e) {
      console.error('Failed to delete from cloud:', e);
    }
  }

  db.recordings.delete().where(eq('id', id));

  return c.json({ success: true });
});

app.delete('/api/recordings/all', async (c) => {
  const recordings = db.recordings.select().from().all();

  for (const recording of recordings) {
    const audioPath = path.join(__dirname, '..', recording.audioPath);
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    if (recording.cloudKey && recording.cloudStatus === 'uploaded') {
      try {
        await deleteFromCloud(recording.cloudKey);
      } catch (e) {
        console.error('Failed to delete from cloud:', recording.id, e);
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, '../data/db.json'), JSON.stringify({ recordings: [] }, null, 2));

  return c.json({ success: true });
});

app.post('/api/cloud/upload/:id', async (c) => {
  const id = c.req.param('id');
  let uploadOption = 'both' as 'audio' | 'summary' | 'both';

  try {
    const body = await c.req.json().catch(() => ({}));
    if (body.uploadOption && ['audio', 'summary', 'both'].includes(body.uploadOption)) {
      uploadOption = body.uploadOption;
    }
  } catch (e) {
    // use default
  }

  const [recording] = db.recordings.select().from().where(eq('id', id));

  if (!recording) {
    return c.json({ error: 'Not found' }, 404);
  }

  if (recording.status !== 'completed') {
    return c.json({ error: 'Recording not completed' }, 400);
  }

  db.recordings.update().set({ cloudStatus: 'uploading' }).where(eq('id', id));

  try {
    const { key, url } = await uploadToCloud(recording, uploadOption);
    db.recordings.update().set({
      cloudStatus: 'uploaded',
      cloudKey: key,
      cloudUrl: url,
    }).where(eq('id', id));

    return c.json({ success: true, key, url });
  } catch (err) {
    console.error('Cloud upload failed:', err);
    db.recordings.update().set({ cloudStatus: 'not_uploaded' }).where(eq('id', id));
    return c.json({ error: 'Upload failed' }, 500);
  }
});

app.delete('/api/cloud/delete/:id', async (c) => {
  const id = c.req.param('id');
  const [recording] = db.recordings.select().from().where(eq('id', id));

  if (!recording) {
    return c.json({ error: 'Not found' }, 404);
  }

  if (!recording.cloudKey) {
    return c.json({ error: 'Not in cloud' }, 400);
  }

  db.recordings.update().set({ cloudStatus: 'deleting' }).where(eq('id', id));

  try {
    await deleteFromCloud(recording.cloudKey);
    db.recordings.update().set({
      cloudStatus: 'not_uploaded',
      cloudKey: null,
      cloudUrl: null,
    }).where(eq('id', id));

    return c.json({ success: true });
  } catch (err) {
    console.error('Cloud delete failed:', err);
    db.recordings.update().set({ cloudStatus: 'uploaded' }).where(eq('id', id));
    return c.json({ error: 'Delete failed' }, 500);
  }
});

app.get('/api/cloud/list', async (c) => {
  try {
    const recordings = await listCloudRecordings();
    return c.json({ recordings });
  } catch (err) {
    console.error('Cloud list failed:', err);
    return c.json({ error: 'List failed' }, 500);
  }
});

app.delete('/api/cloud/record/:key', async (c) => {
  const key = decodeURIComponent(c.req.param('key'));
  try {
    await deleteFromCloud(key);
    return c.json({ success: true });
  } catch (err) {
    console.error('Cloud delete failed:', err);
    return c.json({ error: 'Delete failed' }, 500);
  }
});

const port = parseInt(process.env.PORT || '8787');
console.log(`Server starting on port ${port}, R2 configured: ${isR2Configured()}`);

serve({
  fetch: app.fetch,
  port,
});
