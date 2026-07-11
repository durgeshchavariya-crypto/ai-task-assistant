# API Endpoints

## Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login, returns access + refresh tokens | No |
| POST | `/auth/refresh` | Exchange refresh token for new access token | No |
| GET | `/auth/profile` | Get logged-in user's profile | Yes |

## Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/tasks` | Get all tasks for logged-in user | Yes |
| GET | `/tasks/:id` | Get a single task by ID | Yes |
| POST | `/tasks` | Create a new task | Yes |
| PUT | `/tasks/:id` | Update a task | Yes |
| DELETE | `/tasks/:id` | Delete a task | Yes |

## AI Chat
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/chat` | Send a message, get AI reply (with task context) | Yes |

## Response Format
All responses return JSON. Errors follow this shape:
```json
{ "error": "Description of what went wrong" }
```

## Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 500 | Server error |