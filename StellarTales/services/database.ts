import { File, Directory, Paths } from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLite from 'expo-sqlite';
import { CultureKey } from '../data/anchorObjects';

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

const DB_NAME = 'stellartales.db';

// Bump this whenever assets/stellartales.db is rebuilt (node scripts/buildDatabase.js).
// A mismatch forces existing installs to re-copy the new database.
const DB_VERSION = 'v2';

let _db: SQLite.SQLiteDatabase | null = null;

// ── Init ───────────────────────────────────────────────────────────────────

/**
 * Copies the pre-populated stellartales.db from the app bundle to the
 * device's writable SQLite directory on first launch, or whenever DB_VERSION
 * changes (i.e. after a stories rebuild). No-ops on subsequent launches.
 * Must be awaited before any DB reads or writes.
 */
export async function initDatabase(): Promise<void> {
  if (_db) return; // already initialized this session

  const sqliteDir   = new Directory(Paths.document, 'SQLite');
  const dbFile      = new File(sqliteDir, DB_NAME);
  // Version marker — an empty file whose name encodes the current DB version.
  // If it's absent the DB is either missing or from a previous build.
  const versionFile = new File(sqliteDir, `${DB_NAME}.${DB_VERSION}`);

  const needsCopy = !dbFile.exists || !versionFile.exists;

  if (needsCopy) {
    if (!sqliteDir.exists) {
      sqliteDir.create({ intermediates: true });
    }

    const asset = Asset.fromModule(require('../assets/stellartales.db'));
    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error('stellartales.db asset could not be resolved');
    }

    // Remove stale DB if present (copy() throws if destination exists)
    if (dbFile.exists) dbFile.delete();
    new File(asset.localUri).copy(dbFile);

    // Write version marker so we skip the copy on next launch
    versionFile.create({ overwrite: true });
  }

  _db = SQLite.openDatabaseSync(DB_NAME);
}

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) throw new Error('Database not initialized — await initDatabase() first');
  return _db;
}

// ── Reads ──────────────────────────────────────────────────────────────────

export function getStory(objectId: string, culture: CultureKey): StoryRow | null {
  return getDb().getFirstSync<StoryRow>(
    'SELECT object_id as objectId, culture, title, body FROM stories WHERE object_id = ? AND culture = ?',
    [objectId, culture],
  ) ?? null;
}

export function getAllStoriesForObject(objectId: string): StoryRow[] {
  return getDb().getAllSync<StoryRow>(
    'SELECT object_id as objectId, culture, title, body FROM stories WHERE object_id = ?',
    [objectId],
  );
}

export function getAudioPath(objectId: string, culture: CultureKey): string | null {
  const row = getDb().getFirstSync<AudioRow>(
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
