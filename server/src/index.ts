import { createApp } from './app';
import { config } from './config';
import { runMigrations } from './db/migrate';

const app = createApp();

runMigrations();

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
