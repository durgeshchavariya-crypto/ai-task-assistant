# AI Task Assistant

A full-stack task management application with an AI assistant that helps users manage, summarize, and get suggestions about their tasks - built with secure authentication, persistent database storage, and real-time AI integration.

## Live Links

- Frontend (Vercel): https://ai-task-assistant-2kx70hn6h-durgesh-chavariya.vercel.app
- Backend API (Render): https://ai-task-assistant-backend.onrender.com
- GitHub Repo: https://github.com/durgeshchavariya-crypto/ai-task-assistant

## Features

- User Authentication: Register/login with JWT-based sessions (access + refresh tokens), passwords hashed with bcrypt
- Task Management: Full CRUD operations - create, view, update (mark complete), and delete tasks, each scoped to the logged-in user
- AI Chat Assistant: Conversational interface where users can ask questions about their tasks; the AI is fed the user's real, current task list as context before responding
- Protected Routes: Dashboard and chat views require authentication; expired tokens automatically redirect to login
- Responsive Design: Clean, mobile-friendly layout across all pages

## Tech Stack

Frontend: React (Vite), React Router, React Query, Axios, Context API

Backend: Node.js, Express, Prisma ORM, SQLite, bcrypt, jsonwebtoken, Groq API (AI chat, used as a free substitute for OpenAI/Gemini due to billing requirements)

Deployment: Vercel (frontend), Render (backend + database), GitHub Actions (CI: lint then build)

## Project Structure

ai-task-assistant/
- client/ (React frontend: api, context, pages)
- server/ (Express backend: prisma, index.js)
- docs/ (wireframes, schema diagram, API docs)

## API Endpoints

See docs/api-endpoints.md for the full list of routes, methods, and auth requirements.

## Local Setup

Backend: cd server, npm install, npx prisma migrate dev, node index.js

Frontend: cd client, npm install, npm run dev

Both require a .env file: DATABASE_URL, GROQ_API_KEY, JWT_SECRET, JWT_REFRESH_SECRET for server; VITE_API_URL for client.

## Screenshots and Wireframes

See docs/wireframes/ for planning sketches and docs/schema.png for the database schema diagram.

## Status

Fully deployed and functional - frontend, backend, and database all live in production.
