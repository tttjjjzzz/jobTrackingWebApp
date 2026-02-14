import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  jobTitle: text('job_title').notNull(),
  company: text('company').notNull(),
  positionType: text('position_type').notNull(),
  positionLength: integer('position_length'),
  dateAdded: text('date_added').notNull(),
  dateApplied: text('date_applied'),
  applied: integer('applied', { mode: 'boolean' }).notNull().default(false),
  applicationLink: text('application_link'),
  comments: text('comments'),
  externalLinks: text('external_links', { mode: 'json' })
    .notNull()
    .default(sql`'[]'`),
  status: text('status').notNull().default('not_applied'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
