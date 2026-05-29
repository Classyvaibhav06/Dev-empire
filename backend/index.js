const app = require('./src/app');
const db = require('./src/config/db');
require('dotenv').config({ override: true });

const PORT = process.env.PORT || 5000;

// Initialize PostgreSQL Schema on Startup
db.initDb()
  .then(() => {
    console.log('PostgreSQL database initialized successfully.');
    
    // Start HTTP Server
    app.listen(PORT, () => {
      console.log(`Server is running in production-grade architecture on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('PostgreSQL database initialization failed:', err);
    process.exit(1);
  });
