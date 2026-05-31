const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config({ override: true });

// Lazy one-time DB init — runs on first request, shared across warm instances
let dbInitPromise = null;
function ensureDb() {
  if (!dbInitPromise) {
    dbInitPromise = db.initDb().catch(err => {
      // Reset so next request retries
      dbInitPromise = null;
      throw err;
    });
  }
  return dbInitPromise;
}

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost',
  'http://localhost:80',
  'http://localhost:8080',
  'https://dev-empire.vercel.app',
  'https://dev-empire-9twz.vercel.app',
  'https://devemire.vaibhav-ghoshi.in',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight explicitly so it never reaches other middleware
app.options('*', cors(corsOptions));

app.use(express.json());

// Ensure DB schema is ready before any route runs
app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    console.error('DB init failed:', err.message);
    res.status(503).json({ error: 'Database unavailable. Please try again.' });
  }
});

// ── Health check for Docker/K8s ──
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount the aggregated router at /api prefix
const apiRouter = require('./routes');
app.use('/api', apiRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Express App Error Handler:', err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
