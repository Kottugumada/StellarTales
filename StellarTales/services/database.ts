import * as SQLite from 'expo-sqlite';
import { ANCHOR_OBJECTS, CultureKey } from '../data/anchorObjects';
import { SEED_STORIES } from '../data/seedStories';

export interface StoryRow {
  objectId: string;
  culture: CultureKey;
  title: string;
  body: string;
}

export interface AudioRow {
  objectId: string;
  culture: CultureKey;
  filePath: string;
}

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync('stellartales.db');
  }
  return _db;
}

export function initDatabase(): void {
  const db = getDb();

  db.execSync(`
    CREATE TABLE IF NOT EXISTS sky_objects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      ra REAL,
      dec REAL,
      magnitude REAL,
      hemisphere TEXT NOT NULL,
      hook_text TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stories (
      object_id TEXT NOT NULL,
      culture TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      PRIMARY KEY (object_id, culture)
    );

    CREATE TABLE IF NOT EXISTS audio_cache (
      object_id TEXT NOT NULL,
      culture TEXT NOT NULL,
      file_path TEXT NOT NULL,
      PRIMARY KEY (object_id, culture)
    );
  `);

  seedObjectsIfEmpty(db);
  seedStoriesIfEmpty(db);
}

function seedObjectsIfEmpty(db: SQLite.SQLiteDatabase): void {
  const count = db.getFirstSync<{ n: number }>('SELECT COUNT(*) as n FROM sky_objects');
  if (count && count.n > 0) return;

  for (const obj of ANCHOR_OBJECTS) {
    db.runSync(
      'INSERT OR IGNORE INTO sky_objects (id, name, category, ra, dec, magnitude, hemisphere, hook_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [obj.id, obj.name, obj.category, obj.ra, obj.dec, obj.magnitude, obj.hemisphere, obj.hookText],
    );
  }
}

function seedStoriesIfEmpty(db: SQLite.SQLiteDatabase): void {
  const count = db.getFirstSync<{ n: number }>('SELECT COUNT(*) as n FROM stories');
  if (count && count.n > 0) return;

  for (const [objectId, cultures] of Object.entries(SEED_STORIES)) {
    if (!cultures) continue;
    for (const [culture, story] of Object.entries(cultures)) {
      if (!story) continue;
      db.runSync(
        'INSERT OR IGNORE INTO stories (object_id, culture, title, body) VALUES (?, ?, ?, ?)',
        [objectId, culture, story.title, story.body],
      );
    }
  }
}

// ── Reads ──────────────────────────────────────────────────────────────────

export function getStory(objectId: string, culture: CultureKey): StoryRow | null {
  const db = getDb();
  return db.getFirstSync<StoryRow>(
    'SELECT object_id as objectId, culture, title, body FROM stories WHERE object_id = ? AND culture = ?',
    [objectId, culture],
  ) ?? null;
}

export function getAllStoriesForObject(objectId: string): StoryRow[] {
  const db = getDb();
  return db.getAllSync<StoryRow>(
    'SELECT object_id as objectId, culture, title, body FROM stories WHERE object_id = ?',
    [objectId],
  );
}

export function getAudioPath(objectId: string, culture: CultureKey): string | null {
  const db = getDb();
  const row = db.getFirstSync<AudioRow>(
    'SELECT object_id as objectId, culture, file_path as filePath FROM audio_cache WHERE object_id = ? AND culture = ?',
    [objectId, culture],
  );
  return row?.filePath ?? null;
}

// ── Writes ─────────────────────────────────────────────────────────────────

export function saveStory(objectId: string, culture: CultureKey, title: string, body: string): void {
  getDb().runSync(
    'INSERT OR REPLACE INTO stories (object_id, culture, title, body) VALUES (?, ?, ?, ?)',
    [objectId, culture, title, body],
  );
}

export function saveAudioPath(objectId: string, culture: CultureKey, filePath: string): void {
  getDb().runSync(
    'INSERT OR REPLACE INTO audio_cache (object_id, culture, file_path) VALUES (?, ?, ?)',
    [objectId, culture, filePath],
  );
}
