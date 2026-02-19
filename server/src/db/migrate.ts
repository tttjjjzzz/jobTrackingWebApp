import { db } from './connection';
import { sql } from 'drizzle-orm';

export function runMigrations() {
  db.run(sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      job_title TEXT NOT NULL,
      company TEXT NOT NULL,
      position_type TEXT NOT NULL,
      position_length INTEGER,
      date_added TEXT NOT NULL,
      date_applied TEXT,
      applied INTEGER NOT NULL DEFAULT 0,
      application_link TEXT,
      comments TEXT,
      external_links TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'not_applied',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Additive column migrations — SQLite has no ADD COLUMN IF NOT EXISTS,
  // so we attempt each and swallow the "duplicate column" error.
  const addColumns = [
    sql`ALTER TABLE jobs ADD COLUMN logo_url TEXT`,
    sql`ALTER TABLE jobs ADD COLUMN location TEXT`,
    sql`ALTER TABLE jobs ADD COLUMN location_lat REAL`,
    sql`ALTER TABLE jobs ADD COLUMN location_lng REAL`,
  ];
  for (const stmt of addColumns) {
    try {
      db.run(stmt);
    } catch {
      // Column already exists — safe to ignore
    }
  }

  console.log('Database migrations complete');
}
