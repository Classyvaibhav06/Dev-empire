const app = require('./src/app');
require('dotenv').config({ override: true });

// Local development: start HTTP server normally
// Vercel serverless: imports this module and uses `module.exports` as the handler
if (require.main === module) {
  const db = require('./src/config/db');
  const PORT = process.env.PORT || 5000;

  db.initDb()
    .then(() => {
      console.log('PostgreSQL database initialized successfully.');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('PostgreSQL database initialization failed:', err);
      process.exit(1);
    });
}

// Vercel uses this export as the serverless function handler
module.exports = app;

