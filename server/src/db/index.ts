import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Recording, NewRecording } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'db.json');

function loadDB(): { recordings: Recording[] } {
  if (!fs.existsSync(dbPath)) {
    return { recordings: [] };
  }
  const content = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(content);
  data.recordings = data.recordings.map((r: any) => ({
    ...r,
    // Only set defaults for fields that don't exist
    cloudStatus: r.cloudStatus ?? 'not_uploaded',
    cloudKey: r.cloudKey ?? null,
    cloudUrl: r.cloudUrl ?? null,
    tags: r.tags ?? [],
    summaryLanguage: r.summaryLanguage ?? 'zh',
  }));
  return data;
}

function saveDB(data: { recordings: Recording[] }) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export const db = {
  recordings: {
    insert: async (values: Recording) => {
      const data = loadDB();
      data.recordings.push(values);
      saveDB(data);
      return values;
    },
    select: () => {
      const data = loadDB();
      return {
        from: () => ({
          where: (predicate: (r: Recording) => boolean) => {
            return data.recordings.filter(predicate);
          },
          orderBy: (orderByFn: (a: Recording, b: Recording) => number) => {
            return [...data.recordings].sort(orderByFn);
          },
          all: () => data.recordings,
        }),
      };
    },
    update: () => {
      return {
        set: (values: Partial<Recording>) => {
          return {
            where: (predicate: (r: Recording) => boolean) => {
              const data = loadDB();
              data.recordings = data.recordings.map((r) =>
                predicate(r) ? { ...r, ...values } : r
              );
              saveDB(data);
            },
          };
        },
      };
    },
    delete: () => {
      return {
        where: (predicate: (r: Recording) => boolean) => {
          const data = loadDB();
          const deleted = data.recordings.filter(predicate);
          data.recordings = data.recordings.filter((r) => !predicate(r));
          saveDB(data);
          return deleted;
        },
      };
    },
  },
};

export function eq<T>(field: keyof Recording, value: T) {
  return (r: Recording) => r[field] === value;
}

export function desc(field: keyof Recording) {
  return (a: Recording, b: Recording) => (b[field] as number) - (a[field] as number);
}
