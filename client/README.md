# AI Task Assistant

A full-stack task management application with an AI assistant that helps users manage, summarize, and get suggestions about their tasks — built with secure authentication, persistent database storage, and real-time AI integration.

## 🔗 Live Links

- **Frontend (Vercel):** https://ai-task-assistant-2kx70hn6h-durgesh-chavariya.vercel.app
- **Backend API (Render):** https://ai-task-assistant-backend.onrender.com
- **GitHub Repo:** https://github.com/durgeshchavariya-crypto/ai-task-assistant

## Features

- **User Authentication:** Register/login with JWT-based sessions (access + refresh tokens), passwords hashed with bcrypt
- **Task Management:** Full CRUD operations — create, view, update (mark complete), and delete tasks, each scoped to the logged-in user
- **AI Chat Assistant:** Conversational interface where users can ask questions about their tasks; the AI is fed the user's real, current task list as context before responding
- **Protected Routes:** Dashboard and chat views require authentication; expired tokens automatically redirect to login
- **Responsive Design:** Clean, mobile-friendly layout across all pages

## Tech Stack

**Frontend:**
- React (Vite)
- React Router (client-side routing)
- React Query (server state management, caching)
- Axios (HTTP client with auth interceptors)
- Context API (global auth state)

**Backend:**
- Node.js + Express
- Prisma ORM + SQLite (database)
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- Groq API (AI chat, Llama models — used as a free substitute for OpenAI/Gemini due to billing requirements)

**Deployment:**
- Vercel (frontend)
- Render (backend + database)
- GitHub Actions (CI: lint → build)

## Project Structure

```
ai-task-assistant/
├── client/              # React frontend
│   └── src/
│       ├── api/         # Axios client with auth interceptors
│       ├── context/     # Auth context
│       └── pages/       # Login, Register, Dashboard, Chat
├── server/              # Express backend
│   ├── prisma/          # Schema and migrations
│   └── index.js         # All API routes
├── docs/                # Wireframes, schema diagram, API docs
└── README.md
```

## API Endpoints

See [`docs/api-endpoints.md`](docs/api-endpoints.md) for the full list of routes, methods, and auth requirements.

## Local Setup

**Backend:**
```bash
cd server
npm install
npx prisma migrate dev
node index.js
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

Both require a `.env` file (see `.env.example` pattern: `DATABASE_URL`, `GROQ_API_KEY`, `JWT_SECRET`, `JWT_REFRESH_SECRET` for server; `VITE_API_URL` for client).

## Screenshots / Wireframes

See [`docs/wireframes/`](docs/wireframes) for planning sketches and [`docs/schema.png`](docs/schema.png) for the database schema diagram.

## Status

✅ Fully deployed and functional — frontend, backend, and database all live in production.