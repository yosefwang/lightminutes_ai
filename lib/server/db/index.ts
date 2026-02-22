import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database, Recording, defaultDatabase } from './schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../..', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load database from file
async function loadDB(): Promise<Database> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is invalid, return default
    return { ...defaultDatabase };
  }
}

// Save database to file
async function saveDB(db: Database) {
  await ensureDataDir();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// Recording operations
export async function getAllRecordings(): Promise<Recording[]> {
  const db = await loadDB();
  return db.recordings.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getRecording(id: string): Promise<Recording | undefined> {
  const db = await loadDB();
  return db.recordings.find((r) => r.id === id);
}

export async function createRecording(recording: Omit<Recording, 'createdAt'>): Promise<Recording> {
  const db = await loadDB();
  const newRecording: Recording = {
    ...recording,
    createdAt: Date.now(),
  };
  db.recordings.push(newRecording);
  await saveDB(db);
  return newRecording;
}

export async function updateRecording(id: string, updates: Partial<Recording>): Promise<Recording | undefined> {
  const db = await loadDB();
  const index = db.recordings.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  db.recordings[index] = {
    ...db.recordings[index],
    ...updates,
  };
  await saveDB(db);
  return db.recordings[index];
}

export async function deleteRecording(id: string): Promise<boolean> {
  const db = await loadDB();
  const index = db.recordings.findIndex((r) => r.id === id);
  if (index === -1) return false;

  // Also delete the audio file if it exists
  const recording = db.recordings[index];
  if (recording.audioPath) {
    const audioPath = path.join(DATA_DIR, '..', recording.audioPath);
    try {
      await fs.unlink(audioPath);
    } catch {
      // Ignore if file doesn't exist
    }
  }

  db.recordings.splice(index, 1);
  await saveDB(db);
  return true;
}

export async function deleteAllRecordings(): Promise<number> {
  const db = await loadDB();
  const count = db.recordings.length;

  // Delete all audio files
  for (const recording of db.recordings) {
    if (recording.audioPath) {
      const audioPath = path.join(DATA_DIR, '..', recording.audioPath);
      try {
        await fs.unlink(audioPath);
      } catch {
        // Ignore if file doesn't exist
      }
    }
  }

  db.recordings = [];
  await saveDB(db);
  return count;
}
