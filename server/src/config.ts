import path from 'node:path';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  dbPath: process.env.DB_PATH || path.join(process.cwd(), 'data', 'jobtracker.db'),
  isDev: process.env.NODE_ENV !== 'production',
};
