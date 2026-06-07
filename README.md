# ⚡ Dev Empire

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-v19.2.5-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-v4.2.4-38bdf8.svg)](https://tailwindcss.com/)
[![Docker Support](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)

Dev Empire is an all-in-one developer ecosystem designed to accelerate learning, code experimentation, and career progression. It combines a multi-language interactive playground, a live web sandbox, AI-driven custom roadmaps, and a gamified progression system (XP, levels, and coding streaks) to deliver a world-class developer experience.

---

## 🗺️ System Architecture & Overview

Dev Empire is built on a decoupled, modern architecture featuring a high-performance React frontend and a robust, serverless-ready Express backend.

```
                      +------------------------------------------+
                      |               Web Browser                |
                      |  (React 19 SPA / Monaco Editor / Canvas) |
                      +----+--------------------------------+----+
                           |                                |
             REST API / JSON |                                | (Local JS Execution)
                           v                                v
              +------------+------------+         +---------+--------+
              |      Express Backend    |         | Browser Sandbox  |
              |   (Vercel Serverless /  |         | (Iframe Preview) |
              |    Docker Container)    |         +------------------+
              +----+-----------+--------+
                   |           |
     +-------------+           +-------------+
     |                                       |
     v (PostgreSQL / MongoDB)                v (REST / HTTPS)
+----+-------------------+             +-----+--------------------+
|  Database Layer        |             | External APIs            |
|  - PostgreSQL (pg)     |             | - Paiza.io (Code Exec)   |
|  - MongoDB (Mongoose)  |             | - OpenAI (AI Roadmaps)   |
+------------------------+             +--------------------------+
```

### Key Components

1. **Frontend SPA (React 19 + Vite 8)**: A blazing-fast user interface styled with Tailwind CSS v4. It features the Monaco Editor for a desktop-grade coding experience, Framer Motion for fluid animations, and Mermaid.js for rendering dynamic, interactive AI roadmaps.
2. **Backend API (Express 5)**: A flexible API layer designed to run seamlessly in both traditional long-running environments (Docker, PM2) and serverless environments (Vercel). It features lazy database initialization to optimize cold-start times.
3. **Execution Engine**:
   * **Local Sandbox**: Runs client-side JavaScript directly in a secure virtual console wrapper.
   * **Remote Sandbox**: Offloads compilation and execution of Python, C++, and Java to a secure, multi-tenant execution runner powered by the Paiza.io API.
4. **Dual-Database Layer**:
   * **PostgreSQL**: Manages relational data including user profiles, authentication, gamification metrics (XP, levels, streaks), and shared code snippets.
   * **MongoDB (Mongoose)**: Handles unstructured operational data, AI chat histories, and complex roadmap structures.

---

## ✨ Features

### 🚀 Interactive Multi-Language Playground
* **Monaco Editor Integration**: Full syntax highlighting, auto-completion, and multi-cursor editing.
* **Multi-Language Support**: Write and run JavaScript, Python, C++, and Java.
* **Hybrid Execution**: JavaScript runs instantly in the browser with a custom virtual console interceptor; backend languages are securely compiled and executed remotely.

### 🌐 Live Web Sandbox
* **Real-time Preview**: Dedicated HTML, CSS, and JS tabs with a debounced, live-updating iframe preview.
* **Console Interceptor**: Captures runtime errors and logs them directly to a unified terminal interface.

### 🧠 AI-Driven Roadmaps & Learning
* **Interactive Roadmaps**: Generate customized learning paths visualized dynamically using Mermaid.js.
* **AI Copilot**: Context-aware AI assistant that analyzes code errors in real-time and suggests instant fixes.

### 🏆 Gamification & Snippet Sharing
* **Progression System**: Earn XP, level up, and maintain daily coding streaks by executing code and completing challenges.
* **Social Snippets**: Save, title, and publish code snippets. Generate shareable URLs with public/private visibility toggles.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19, Vite 8, React Router DOM v7
* **Editor**: `@monaco-editor/react` (Monaco Editor wrapper)
* **Styling**: Tailwind CSS v4, PostCSS, Lucide React (icons)
* **Animations**: Framer Motion
* **Visualizations**: Mermaid.js (for rendering roadmaps)

### Backend
* **Core**: Express 5, Node.js
* **Databases**: PostgreSQL (`pg`), MongoDB (`mongoose`)
* **AI Integration**: OpenAI SDK
* **Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS
* **Execution**: Paiza.io Engine integration

---

## 📂 Directory Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment configurations
│   │   ├── controllers/     # Route controllers (auth, playground, roadmaps)
│   │   ├── middlewares/     # Auth guards, error handlers, rate-limiters
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Code execution & AI roadmap generation
│   │   └── utils/           # Helper functions
│   ├── index.js             # Local entry point
│   ├── app.js               # Express application configuration
│   ├── Dockerfile           # Backend containerization
│   └── vercel.json          # Serverless deployment config
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (buttons, modals, cards)
│   │   ├── context/         # Auth and Global State providers
│   │   ├── pages/           # Page views (Playground, Dashboard, Roadmaps)
│   │   ├── config.js        # API base URL configurations
│   │   └── main.jsx         # Frontend entry point
│   ├── Dockerfile           # Frontend containerization
│   └── nginx.conf           # Production Nginx server configuration
└── docker-compose.yml       # Multi-container orchestration config
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.x` or higher
* **Docker & Docker Compose** (Optional, for containerized setup)
* **PostgreSQL**: `v15.x` or higher
* **MongoDB**: `v6.x` or higher

---

### Method 1: Quick Start with Docker Compose (Recommended)

The easiest way to spin up the entire ecosystem (Frontend, Backend, PostgreSQL, and MongoDB) is using Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/Classyvaibhav06/Dev-empire.git
   cd Dev-empire
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   * **Frontend**: `http://localhost:80` (or `http://localhost:5173` depending on environment mapping)
   * **Backend API**: `http://localhost:5000`

---

### Method 2: Local Manual Installation

#### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/devempire
   MONGODB_URI=mongodb://localhost:27017/devempire
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=your_openai_api_key
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
4. Initialize and run the database migrations/seeding:
   ```bash
   node populate.js
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

#### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | Port number for the Express server | `5000` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key used to sign JWT tokens | - | Yes |
| `OPENAI_API_KEY` | OpenAI API Key for generating roadmaps | - | No (disables AI features) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:5173` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend Express API | `http://localhost:5000` | Yes |

---

## 💻 Usage & Code Examples

### 1. Executing Code via the Playground API

The backend exposes a unified endpoint `/api/playground/execute` to run code on remote sandboxes.

#### Request:
```bash
curl -X POST http://localhost:5000/api/playground/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "python",
    "code": "def greet():\n    print(\"Hello from Dev Empire!\")\ngreet()"
  }'
```

#### Response:
```json
{
  "run": {
    "output": "Hello from Dev Empire!\n",
    "stderr": "",
    "code": 0
  }
}
```

### 2. Sharing a Code Snippet

Users can save and share code snippets by sending payloads to the playground router.

#### Request:
```bash
curl -X POST http://localhost:5000/api/playground/snippet \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Binary Search in Python",
    "description": "An optimized iterative binary search implementation.",
    "language": "python",
    "code": "def binary_search(arr, x):\n    # implementation here...",
    "is_public": true
  }'
```

---

## 🧪 Development & Testing

The repository contains test scripts to verify the integration with external execution engines like Paiza.io.

### Run Code Execution Engine Tests
To verify that the backend can communicate with the remote compilation API, run:

```bash
cd backend
node test-paiza.js
```

To test the local backend API execution endpoint directly:
```bash
node test-api.js
```

### Code Style & Linting
To keep the frontend codebase clean and standardized:
```bash
cd frontend
npm run lint
```

---

## ☁️ Deployment

### Serverless Deployment (Vercel)

The backend is configured for serverless deployment on Vercel using the `vercel.json` configuration.

#### Database Connection Pooling in Serverless
To prevent database connection exhaustion during serverless scaling, the backend implements a lazy initialization strategy in `backend/src/app.js`:

```javascript
let dbInitPromise = null;
function ensureDb() {
  if (!dbInitPromise) {
    dbInitPromise = db.initDb().catch(err => {
      dbInitPromise = null; // Retry on subsequent requests if failed
      throw err;
    });
  }
  return dbInitPromise;
}
```

To deploy the backend to Vercel:
```bash
cd backend
vercel --prod
```

---

## 🛠️ Troubleshooting

### 1. CORS Errors on Frontend
If you encounter CORS errors when making API requests:
* Check that your backend `.env` file contains the correct `ALLOWED_ORIGINS` (e.g., `ALLOWED_ORIGINS=http://localhost:5173`).
* Ensure that trailing slashes are omitted from the frontend configuration.

### 2. Database Initialization Fails
If the backend fails to start with database connection errors:
* Ensure PostgreSQL and MongoDB services are running locally or inside Docker.
* Verify the connection strings in your `.env` file.
* If using Docker Compose, ensure the database containers have fully initialized before the backend container starts (`depends_on` healthchecks are configured in `docker-compose.yml`).

### 3. Paiza.io Execution Timeouts
If remote code execution times out:
* The Paiza.io API is free and public; occasionally, it experiences high traffic. The backend polls for results up to 15 times with a 1-second delay. If timeouts persist, check your internet connection or verify if the Paiza.io API is operational.

---

## 🗺️ Roadmap

- [ ] **Interactive Coding Challenges**: LeetCode-style algorithm challenges with automated test suites.
- [ ] **Collaborative Playgrounds**: Real-time multi-user collaborative coding sessions using WebSockets.
- [ ] **Expanded Language Support**: Add support for Rust, Go, and Ruby execution.
- [ ] **Offline Mode**: Enable local-first playground execution using WebAssembly (Wasm) runtimes.

---

## 📄 License & Credits

This project is licensed under the **ISC License**.

### Acknowledgments
* [Paiza.io](https://paiza.io/) for providing a free, robust code execution API.
* [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the powerful core editor experience.
* [Mermaid.js](https://mermaid.js.org/) for making complex learning roadmaps visually accessible.