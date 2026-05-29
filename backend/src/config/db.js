const { Pool } = require('pg');
require('dotenv').config({ override: true });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 20,                          // Maximum connection pool size
  idleTimeoutMillis: 30000,         // Close idle connections after 30 seconds
  connectionTimeoutMillis: 15000,   // Allow up to 15 seconds for Neon cold starts
  ssl: {
    rejectUnauthorized: false       // Required for Neon cloud connection
  }
});

// Prevent Node.js from crashing on idle connection drops (common with Neon's scale-to-zero)
pool.on('error', (err, client) => {
  console.error('Unexpected database error on idle client:', err.message);
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

    // Add Streak and GitHub columns if they don't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_active_date DATE,
      ADD COLUMN IF NOT EXISTS github_username VARCHAR(100);
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

    // Create User Activities Table (for Heatmap)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        action_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create User Badges Table (for Achievements)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        badge_id VARCHAR(50) NOT NULL,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
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

    // Create Shared Snippets Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shared_snippets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) DEFAULT 'Untitled Snippet',
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        code TEXT,
        html_code TEXT,
        css_code TEXT,
        language VARCHAR(50) DEFAULT 'javascript',
        upvotes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Snippet Upvotes Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS snippet_upvotes (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        snippet_id UUID REFERENCES shared_snippets(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, snippet_id)
      );
    `);

    // Create User Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_projects (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        topic_id VARCHAR(100) NOT NULL,
        github_url TEXT NOT NULL,
        live_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, topic_id)
      );
    `);

    // Create Topic Comments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS topic_comments (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        topic_id VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Speed up queries on user reference joins and heatmap date ranges (indices)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_concept_scores_user_id ON concept_scores(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_completed_challenges_user_id ON completed_challenges(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
      CREATE INDEX IF NOT EXISTS idx_shared_snippets_user_id ON shared_snippets(user_id);
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
