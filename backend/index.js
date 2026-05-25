const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_empire_jwt_token_key_1234';
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dev-empire-9twz.vercel.app',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
];

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Initialize PostgreSQL Schema on Startup
db.initDb()
  .then(() => console.log('PostgreSQL database initialized.'))
  .catch(err => {
    console.error('PostgreSQL database initialization failed:', err);
    process.exit(1);
  });

// Detailed concepts mapping for all topics
const detailedTopics = {
  "how-the-web-works": {
    id: "how-the-web-works",
    title: "How the Web Works",
    description: "Understand the basics of the internet, HTTP/HTTPS, DNS, and how browsers render web pages.",
    videos: ["https://www.youtube.com/embed/7_LPdttKXPc"],
    keyConcepts: [
      "Client-Server Architecture",
      "IP Addresses & DNS (Domain Name System)",
      "HTTP/HTTPS Protocols & Status Codes",
      "Request/Response Cycle",
      "How Browsers Parse HTML/CSS/JS"
    ],
    tips: "Understand the general flow: You type a URL, DNS finds the IP, your browser requests the page, and the server sends HTML back.",
    mistakes: "Thinking 'The Internet' and 'The Web' are the same. The Internet is the physical infrastructure; the Web is the collection of pages running on it.",
    project: {
      title: "Interactive Request-Response Diagram",
      description: "Create a simple sketch or workflow diagram outlining exactly what happens step-by-step when you type 'dev-empire.com' in a browser, from DNS resolution to DOM compilation."
    }
  },
  "html-basics": {
    id: "html-basics",
    title: "HTML Basics & Semantics",
    description: "Learn the foundational structure of the web. HTML defines the content and semantics of all web pages.",
    videos: ["https://www.youtube.com/embed/qz0aGYrrlhU"],
    keyConcepts: [
      "HTML Document structure & tags",
      "Elements, Attributes, and Headings",
      "Lists, Tables, and Forms",
      "Semantic HTML (nav, section, article, header, footer)",
      "Accessibility (a11y) & SEO best practices"
    ],
    tips: "Always use semantic tags where possible instead of just using <div> for everything. It helps screen readers and search engines.",
    mistakes: "Using non-semantic div tags for every section, which hurts SEO and accessibility.",
    project: {
      title: "Semantic Personal Portfolio",
      description: "Build a single page website for your developer resume using only semantic tags. No styles yet!"
    }
  },
  "css-basics": {
    id: "css-basics",
    title: "CSS Basics & Box Model",
    description: "Learn how to style your HTML elements. Understand the CSS Box Model, selectors, and layout basics.",
    videos: ["https://www.youtube.com/embed/1Rs2ND1ryYc"],
    keyConcepts: [
      "CSS Syntax and Stylesheets linking",
      "CSS Selectors (Class, ID, Elements, Pseudo-selectors)",
      "The CSS Box Model (Content, Padding, Border, Margin)",
      "Display Properties (block, inline, inline-block, flex, grid)",
      "Colors, Typography, and Transitions"
    ],
    tips: "When debugging layout issues, add a temporary border to see exactly how much space an element occupies.",
    mistakes: "Confusing Margin (space outside the border) with Padding (space inside the border).",
    project: {
      title: "Styled Profile Card",
      description: "Take your portfolio info or write a new user card. Add padding, rounded borders, shadows, a beautiful background gradient, and center it perfectly using flexbox."
    }
  },
  "js-basics": {
    id: "js-basics",
    title: "JavaScript Fundamentals",
    description: "Add logic and interactivity to your websites using variables, functions, and control flow.",
    videos: ["https://www.youtube.com/embed/W6NZfCO5SIk"],
    keyConcepts: [
      "Variables & Data Types (let, const, objects, arrays)",
      "Functions and Scope",
      "Control Flow (loops, conditionals)",
      "DOM Manipulation and Event Listeners",
      "ES6+ features (destructuring, array methods like map/filter)"
    ],
    tips: "Always use 'const' by default. Only use 'let' if you know the variable's value will change. Never use 'var'.",
    mistakes: "Using 'var' instead of 'const' or 'let', leading to scoping issues.",
    project: {
      title: "Interactive Counter & Todo List",
      description: "Create an interactive counter in Vanilla JS with increment, decrement, and reset buttons, then extend it into a simple in-memory todo list item adder."
    }
  },
  "react-basics": {
    id: "react-basics",
    title: "React Fundamentals",
    description: "Learn functional components, props, state, and rendering dynamic interfaces.",
    videos: ["https://www.youtube.com/embed/bMknfKXIFA8"],
    keyConcepts: [
      "Components and JSX Syntax",
      "Props vs State",
      "The useState and useEffect Hooks",
      "Handling Events & Forms",
      "Conditional Rendering & Lists rendering"
    ],
    tips: "React state should be treated as immutable. Always use the setter function (e.g., setCounter) to update state, never modify it directly.",
    mistakes: "Mutating React state directly (e.g., state.push() instead of using a setter function).",
    project: {
      title: "Todo App with LocalStorage",
      description: "Build a complete Todo application in React with the ability to add, toggle completion status, delete items, and persist the list using useEffect with LocalStorage."
    }
  },
  "node-express": {
    id: "node-express",
    title: "Node.js & Express REST APIs",
    description: "Learn how to build servers with Node.js and create RESTful APIs using the Express framework.",
    videos: ["https://www.youtube.com/embed/Oe421EPjeBE"],
    keyConcepts: [
      "Node.js Runtime & NPM Ecosystem",
      "Express Server Setup & Routing",
      "HTTP Request Methods (GET, POST, PUT, DELETE)",
      "Middleware concept and parsing requests",
      "API design and Status Codes"
    ],
    tips: "Always test your API endpoints using a tool like Postman or Insomnia before trying to connect your frontend.",
    mistakes: "Forgetting to send back an HTTP response (res.send/res.json), leaving the client connection hanging.",
    project: {
      title: "Task API Server",
      description: "Build an Express API server running on port 5000 that manages an in-memory array of Tasks. Write routes for GET /tasks, POST /tasks, PUT /tasks/:id, and DELETE /tasks/:id."
    }
  },
  "mongodb-mongoose": {
    id: "mongodb-mongoose",
    title: "MongoDB & Mongoose ODM",
    description: "Understand NoSQL databases, connect to MongoDB, and perform CRUD operations with Mongoose.",
    videos: ["https://www.youtube.com/embed/DZBGEVgL2eE"],
    keyConcepts: [
      "SQL vs NoSQL Databases concept",
      "Documents, Collections, and ObjectID",
      "Mongoose Connection, Schemas & Models",
      "CRUD operations (find, create, updateOne, deleteMany)",
      "Relationships and DB references"
    ],
    tips: "Define strict schemas in Mongoose to ensure data consistency in your NoSQL database.",
    mistakes: "Storing plaintext passwords in the database. Always use hashing libraries like bcrypt!",
    project: {
      title: "Task Database Manager",
      description: "Refactor your Task API Server to connect to a local or cloud MongoDB database using Mongoose. Define a TaskSchema and model, saving all tasks to the DB."
    }
  },
  "python-basics": {
    id: "python-basics",
    title: "Python Fundamentals",
    description: "Learn Python syntax, data structures, object-oriented concepts, and basic scripting.",
    videos: ["https://www.youtube.com/embed/rfscVS0vtbw"],
    keyConcepts: [
      "Variables & Indentation-based block scope",
      "Lists, Dictionaries, Tuples, and Sets",
      "Functions and Lambdas",
      "Object-Oriented Programming (Classes & Inheritance)",
      "File operations & Exception handling"
    ],
    tips: "Python uses indentation to define code blocks. Keep spacing consistent (4 spaces).",
    mistakes: "Mixing tabs and spaces for indentation, which throws an IndentationError.",
    project: {
      title: "CLI Gradebook System",
      description: "Write a command-line interface Gradebook app where users can add students, records of classes, calculate average grades, and print results to the console."
    }
  },
  "numpy-pandas": {
    id: "numpy-pandas",
    title: "Data Analysis with NumPy & Pandas",
    description: "Perform data structures transformations, indexing, grouping, and statistical operations.",
    videos: ["https://www.youtube.com/embed/r-uOLxNrNk8"],
    keyConcepts: [
      "NumPy Arrays and Vectorized operations",
      "Pandas Series and DataFrames",
      "Data Cleaning: Missing values, Dropping columns",
      "Data Selection, Filtering & Grouping",
      "Reading CSV/JSON files and merging datasets"
    ],
    tips: "Prefer vectorized calculations over iterating with Python loops to preserve speed.",
    mistakes: "Using slow Python loops (like for) to iterate over DataFrame rows instead of using fast vectorized methods.",
    project: {
      title: "Global Temperature Data Analysis",
      description: "Download a public CSV dataset containing global temperature recordings. Load it using Pandas, clean the missing values, group data by year, and compute average temperature shifts."
    }
  },
  "neural-networks": {
    id: "neural-networks",
    title: "Intro to Neural Networks",
    description: "Understand perceptrons, backpropagation, and activation functions inside Deep Learning.",
    videos: ["https://www.youtube.com/embed/aircAruvnKk"],
    keyConcepts: [
      "The Perceptron & Linear Models",
      "Activation Functions (ReLU, Sigmoid, Softmax)",
      "Feedforward & Backpropagation propagation",
      "Loss Functions and Gradient Descent optimization",
      "Layers: Input, Hidden, and Output layers"
    ],
    tips: "Break symmetry by initializing weights to small non-zero random values.",
    mistakes: "Setting learning rates too high, causing gradient descent to overshoot the minimum and diverge.",
    project: {
      title: "Simple Neural Network from Scratch",
      description: "Build a single-neuron perceptron in Python using only NumPy to perform binary classification (like the OR logical gate)."
    }
  },
  "nlp-llms": {
    id: "nlp-llms",
    title: "Large Language Models & Prompting",
    description: "Learn transformer architectures, fine-tuning techniques, and intelligent agent orchestrations.",
    videos: ["https://www.youtube.com/embed/zjkBMFhNj_g"],
    keyConcepts: [
      "Transformer Architectures & Self-Attention mechanism",
      "Tokenization and Embedding spaces",
      "Pre-training vs Fine-tuning (RLHF)",
      "Prompt Engineering techniques (CoT, few-shot)",
      "Agent Frameworks (LangChain, MCP)"
    ],
    tips: "Provide clear examples and structure parameters clearly in your prompt templates.",
    mistakes: "Assuming LLMs have real-time memory of all current news, failing to account for their training cutoff date.",
    project: {
      title: "Interactive Prompt Engineering Playground",
      description: "Write a script connecting to an LLM API (e.g. OpenAI or Gemini). Create comparative templates showcasing zero-shot, few-shot, and Chain-of-Thought prompting outcomes."
    }
  }
};

const seedData = [
  {
    id: "frontend",
    roadmap: "Frontend Development",
    description: "Master the art of building beautiful, interactive user interfaces with HTML, CSS, JavaScript, and React.",
    sections: [
      {
        id: "fe-fundamentals",
        title: "Frontend Fundamentals",
        topics: [
          detailedTopics["how-the-web-works"],
          detailedTopics["html-basics"],
          detailedTopics["css-basics"]
        ]
      },
      {
        id: "fe-advanced",
        title: "Modern Frontend Development",
        topics: [
          detailedTopics["js-basics"],
          detailedTopics["react-basics"]
        ]
      }
    ]
  },
  {
    id: "backend",
    roadmap: "Backend Development",
    description: "Build robust, scalable servers, design databases, and create secure REST APIs.",
    sections: [
      {
        id: "be-fundamentals",
        title: "Server & API Design",
        topics: [
          detailedTopics["node-express"]
        ]
      },
      {
        id: "be-databases",
        title: "Databases & Persistence",
        topics: [
          detailedTopics["mongodb-mongoose"]
        ]
      }
    ]
  },
  {
    id: "fullstack",
    roadmap: "Full-Stack Web Development",
    description: "Combine frontend visual design with backend server systems to build complete web applications.",
    sections: [
      {
        id: "fs-frontend",
        title: "Full-Stack Frontend",
        topics: [
          detailedTopics["html-basics"],
          detailedTopics["css-basics"],
          detailedTopics["js-basics"],
          detailedTopics["react-basics"]
        ]
      },
      {
        id: "fs-backend",
        title: "Full-Stack Backend",
        topics: [
          detailedTopics["node-express"],
          detailedTopics["mongodb-mongoose"]
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    roadmap: "AI & Machine Learning",
    description: "Dive into data science, machine learning models, neural networks, and modern LLMs.",
    sections: [
      {
        id: "ai-math-python",
        title: "Python & Data Science",
        topics: [
          detailedTopics["python-basics"],
          detailedTopics["numpy-pandas"]
        ]
      },
      {
        id: "ai-neural-nets",
        title: "Deep Learning & AI Models",
        topics: [
          detailedTopics["neural-networks"],
          detailedTopics["nlp-llms"]
        ]
      }
    ]
  }
];

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

// ==================== AUTHENTICATION ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required credentials' });
  }

  try {
    // Check if user already exists
    const checkUser = await db.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, level, xp',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, level, xp FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== USER PROFILE & PROGRESS SYNCING ====================

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    // Get User profile information
    const userResult = await db.query('SELECT id, username, email, level, xp FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Get Completed topics array
    const progressResult = await db.query('SELECT topic_id FROM user_progress WHERE user_id = $1', [req.user.id]);
    const completedTopics = progressResult.rows.map(row => row.topic_id);

    // Get Concept quiz scores dictionary
    const scoresResult = await db.query('SELECT * FROM concept_scores WHERE user_id = $1', [req.user.id]);
    const conceptScores = {};
    scoresResult.rows.forEach(row => {
      conceptScores[row.concept_key] = {
        score: row.score,
        selected: row.selected_option,
        conceptTitle: row.concept_title,
        topicId: row.topic_id,
        topicTitle: row.topic_title,
        timestamp: row.created_at
      };
    });

    // Get Completed Challenges list
    const challengesResult = await db.query('SELECT challenge_id FROM completed_challenges WHERE user_id = $1', [req.user.id]);
    const completedChallenges = challengesResult.rows.map(row => row.challenge_id);

    res.json({
      user,
      completedTopics,
      conceptScores,
      completedChallenges
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Roadmap topic completion
app.post('/api/user/progress', authenticateToken, async (req, res) => {
  const { topicId, completed } = req.body;
  if (!topicId) return res.status(400).json({ error: 'Missing topicId' });

  try {
    if (completed) {
      await db.query(
        'INSERT INTO user_progress (user_id, topic_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.user.id, topicId]
      );
    } else {
      await db.query(
        'DELETE FROM user_progress WHERE user_id = $1 AND topic_id = $2',
        [req.user.id, topicId]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync Quiz Score & Award +15 XP
app.post('/api/user/concept-score', authenticateToken, async (req, res) => {
  const { conceptKey, score, selectedOption, conceptTitle, topicId, topicTitle } = req.body;
  if (!conceptKey || score === undefined) return res.status(400).json({ error: 'Missing conceptKey or score' });

  try {
    // 1. Check if user already passed this specific concept check
    const checkPassed = await db.query(
      'SELECT id FROM concept_scores WHERE user_id = $1 AND concept_key = $2 AND score = 1',
      [req.user.id, conceptKey]
    );
    const alreadyPassed = checkPassed.rows.length > 0;

    // 2. Insert or update the quiz attempt
    await db.query(`
      INSERT INTO concept_scores (user_id, concept_key, score, selected_option, concept_title, topic_id, topic_title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, concept_key)
      DO UPDATE SET score = $3, selected_option = $4, concept_title = $5, topic_id = $6, topic_title = $7
    `, [req.user.id, conceptKey, score, selectedOption, conceptTitle, topicId, topicTitle]);

    // 3. Award 15 XP if they passed for the first time
    let xpAdded = 0;
    let newXp = 0;
    let newLevel = 1;

    if (score === 1 && !alreadyPassed) {
      xpAdded = 15;
      const userXpQuery = await db.query('SELECT xp FROM users WHERE id = $1', [req.user.id]);
      const currentXp = userXpQuery.rows[0]?.xp || 0;
      newXp = currentXp + xpAdded;
      newLevel = Math.floor(newXp / 100) + 1;

      await db.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [newXp, newLevel, req.user.id]);
    }

    res.json({ success: true, xpAdded, newXp, newLevel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark coding challenge as completed & Award +50 XP
app.post('/api/user/challenge', authenticateToken, async (req, res) => {
  const { challengeId } = req.body;
  if (!challengeId) return res.status(400).json({ error: 'Missing challengeId' });

  try {
    // 1. Check if already solved
    const checkSolved = await db.query(
      'SELECT id FROM completed_challenges WHERE user_id = $1 AND challenge_id = $2',
      [req.user.id, challengeId]
    );

    if (checkSolved.rows.length > 0) {
      return res.json({ success: true, xpAdded: 0 }); // Already solved previously
    }

    // 2. Insert completion
    await db.query(
      'INSERT INTO completed_challenges (user_id, challenge_id) VALUES ($1, $2)',
      [req.user.id, challengeId]
    );

    // 3. Award 50 XP
    const userXpQuery = await db.query('SELECT xp FROM users WHERE id = $1', [req.user.id]);
    const currentXp = userXpQuery.rows[0]?.xp || 0;
    const xpAdded = 50;
    const newXp = currentXp + xpAdded;
    const newLevel = Math.floor(newXp / 100) + 1;

    await db.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [newXp, newLevel, req.user.id]);

    res.json({ success: true, xpAdded, newXp, newLevel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CHAT SESSION ROUTES ====================

// List all chat sessions for a user (newest first)
app.get('/api/chat-sessions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, created_at, updated_at FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new chat session
app.post('/api/chat-sessions', authenticateToken, async (req, res) => {
  const { title, messages } = req.body;
  const sessionTitle = title || 'New Conversation';
  const sessionMessages = messages || [];
  try {
    const result = await db.query(
      'INSERT INTO chat_sessions (user_id, title, messages) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, sessionTitle, JSON.stringify(sessionMessages)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single chat session with full messages
app.get('/api/chat-sessions/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a chat session (messages + title)
app.put('/api/chat-sessions/:id', authenticateToken, async (req, res) => {
  const { title, messages } = req.body;
  try {
    const result = await db.query(
      `UPDATE chat_sessions 
       SET messages = $1, title = COALESCE($2, title), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [JSON.stringify(messages), title, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a chat session
app.delete('/api/chat-sessions/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== REST OF THE ENDPOINTS ====================


app.get('/api/roadmap', async (req, res) => {
  try {
    const { path } = req.query;
    if (path) {
      const filtered = seedData.filter(r => r.id === path);
      return res.json(filtered);
    }
    res.json(seedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages, mode } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const useFast = (mode === 'fast');
    const modelName = useFast ? "meta/llama-3.1-8b-instruct" : "deepseek-ai/deepseek-v4-flash";

    const completionOptions = {
      model: modelName,
      messages: messages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: useFast ? 4096 : 16384,
      stream: true,
    };

    if (!useFast) {
      completionOptions.chat_template_kwargs = { "thinking": true, "reasoning_effort": "high" };
    }

    const completion = await openai.chat.completions.create(completionOptions);

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta;
      const content = delta?.content || '';
      const reasoning = delta?.reasoning || delta?.reasoning_content || '';
      
      if (content || reasoning) {
        res.write(`data: ${JSON.stringify({ content, reasoning })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Error in chat stream:', err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.post('/api/concept/enrich', async (req, res) => {
  const { title, category, context, conceptTitle, topicTitle } = req.body;

  try {
    const prompt = `You are the Dev Empire AI Curriculum Architect.
Your task is to provide highly enriched, comprehensive, and detailed study notes on a specific node within a roadmap visualization.
 
Context:
- Domain/Topic: ${topicTitle}
- Concept: ${conceptTitle}
- Node Title: ${title}
- Node Category: ${category}
- Current short definition: ${context}

Generate an exhaustive, deep-dive explanation for this specific component. Include:
1. Architectural overview and why it works the way it does.
2. Advanced patterns, edge cases, or potential hidden complexities.
3. Production best practices.
4. A concrete real-world analogy.

Keep your response professional, engaging, formatted in clean markdown without title headings (use bold text or paragraphs for subheadings), and about 250-350 words of high-density learning material.`;

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: "You are an expert curriculum designer. Provide rich, technical, and clear explanations in markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    const enrichedContent = completion.choices[0]?.message?.content || "Enriched details currently unavailable.";
    res.json({ enrichedContent });
  } catch (err) {
    console.error('Error in concept enrichment:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
