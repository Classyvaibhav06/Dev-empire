# Dev Empire — Docker Setup

Run the entire **Dev Empire** stack (frontend + backend) with a single command.

## Architecture

```
Browser → http://localhost
              │
          [Nginx :80]          ← serves the built React app
              │
         /api/* requests
              │
     [Backend Node.js :5000]   ← Express API
              │
     [Neon PostgreSQL]          ← Cloud DB (external)
```

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Quick Start

**1. Clone and enter the project**
```bash
git clone <your-repo-url>
cd Dev-empire
```

**2. Verify the root `.env` file has your secrets**
```bash
# The .env file at the root is already pre-filled with dev values.
# For production, replace with real secrets.
cat .env
```

**3. Build and start all containers**
```bash
docker compose up --build
```

**4. Open the app**
```
http://localhost
```

That's it! 🎉

---

## Useful Commands

| Command | Description |
|---|---|
| `docker compose up --build` | Build images and start all services |
| `docker compose up -d` | Start in detached (background) mode |
| `docker compose down` | Stop and remove containers |
| `docker compose logs -f` | Follow logs from all services |
| `docker compose logs -f backend` | Follow backend logs only |
| `docker compose ps` | Check container status |

## Environment Variables

All secrets are loaded from the root `.env` file:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `OPENAI_API_KEY` | API key for the AI (NVIDIA / OpenAI) |
| `OPENAI_BASE_URL` | Base URL for the AI API endpoint |

> ⚠️ **Never commit the `.env` file to git!** It is already in `.gitignore`.

## Ports

| Service | Port | Notes |
|---|---|---|
| Frontend (Nginx) | `80` | Main app — open this in browser |
| Backend (Express) | `5000` | Exposed for debugging; can remove for production |
