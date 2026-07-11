# AI Task Assistant

## Overview
AI Task Assistant is a full-stack web application that combines secure user authentication, task management (CRUD operations), and an AI-powered chat assistant that helps users manage, summarize, and get suggestions about their tasks.

## Problem It Solves
Traditional to-do apps require manual organization. AI Task Assistant lets users interact conversationally with their task list — asking the AI to summarize pending work, suggest priorities, or add tasks via natural language.

## Core Features
- **User Authentication:** Register/login with JWT-based sessions, role-based access (admin/user)
- **Task Management:** Full CRUD operations on tasks (create, read, update, delete), each tied to a logged-in user
- **AI Chat Assistant:** Conversational interface where users can ask questions about their tasks, get summaries, or receive suggestions
- **Protected Routes:** Dashboard and task views only accessible to authenticated users

## Tech Stack
- **Frontend:** React, React Router, Context API (theme), Axios
- **Backend:** Node.js, Express
- **Auth:** bcrypt (password hashing), JWT (access + refresh tokens)
- **AI Integration:** Groq API (Llama models)
- **Database:** In-memory store (for MVP); can be extended to MongoDB/PostgreSQL later

## Project Structure