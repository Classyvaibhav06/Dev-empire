const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Neon cloud connection
  }
});

async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Initializing PostgreSQL database schema...');
    
    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add Streak columns if they don't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_active_date DATE;
    `);

    // Create User Progress Table (Roadmap/Topic Completion)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        topic_id VARCHAR(100) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_topic UNIQUE (user_id, topic_id)
      );
    `);

    // Create Concept Scores Table (Interactive Quiz Scores)
    await client.query(`
      CREATE TABLE IF NOT EXISTS concept_scores (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        concept_key VARCHAR(100) NOT NULL,
        score INT DEFAULT 0,
        selected_option INT,
        concept_title VARCHAR(255),
        topic_id VARCHAR(100),
        topic_title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_concept UNIQUE (user_id, concept_key)
      );
    `);

    // Create Completed Challenges Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS completed_challenges (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        challenge_id VARCHAR(100) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_challenge UNIQUE (user_id, challenge_id)
      );
    `);

    // Create Chat Sessions Table (Global AI Assistant history)
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
        messages JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Playground Saves Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS playground_saves (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        code TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_playground UNIQUE (user_id)
      );
    `);

    // Create Achievements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(50) NOT NULL,
        rarity VARCHAR(20) DEFAULT 'Common'
      );
    `);

    // Create User Achievements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      );
    `);

    // Seed default achievements
    await client.query(`
      INSERT INTO achievements (code, title, description, icon, rarity) VALUES 
        ('first_login', 'Hello World', 'Log in for the first time.', 'User', 'Common'),
        ('streak_3', 'Rising Star', 'Maintain a 3-day login streak.', 'Flame', 'Rare'),
        ('streak_7', 'Week Warrior', 'Maintain a 7-day login streak.', 'Flame', 'Epic'),
        ('first_challenge', 'First Blood', 'Solve your first coding challenge.', 'Code2', 'Common'),
        ('challenge_5', 'Problem Solver', 'Solve 5 coding challenges.', 'Code2', 'Rare'),
        ('quiz_perfect', 'Flawless Victory', 'Score 100% on a concept quiz.', 'Star', 'Rare'),
        ('roadmap_path_1', 'Pathfinder', 'Complete your first roadmap topic.', 'BookOpen', 'Common')
      ON CONFLICT (code) DO NOTHING;
    `);

    console.log('PostgreSQL schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initDb,
  query: (text, params) => pool.query(text, params)
};
