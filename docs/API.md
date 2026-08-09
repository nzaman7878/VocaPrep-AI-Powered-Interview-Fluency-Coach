# API Documentation

VocaPrep utilizes a RESTful API architecture built with Express.js.

## Authentication (`/api/auth`)

- `POST /register`: Register a new user
- `POST /login`: Authenticate and receive a JWT
- `GET /me`: Get current authenticated user details

## Users (`/api/users`)

- `GET /profile`: Get user profile
- `PUT /profile`: Update user profile details

## Sessions (`/api/sessions`)

- `POST /start`: Initialize a new interview session
- `POST /:sessionId/complete`: Complete the session and trigger ChromaDB vector embeddings
- `GET /history`: Get a paginated history of past sessions
- `GET /:sessionId`: Get detailed session results

## Audio & Transcription (`/api/audio`, `/api/transcription`)

- `POST /api/audio/upload`: Upload an audio blob (currently uses Cloudinary/Disk storage)
- `POST /api/transcription/transcribe`: Send an audio file to AssemblyAI for transcription and word-level timestamps

## Questions & Evaluation (`/api/questions`, `/api/evaluate`)

- `POST /api/questions/generate`: Generate a personalized interview question based on the chosen role and the user's historical weak areas (RAG via ChromaDB).
- `POST /api/evaluate/answer`: Main LangGraph pipeline trigger. Transcribes audio, evaluates content, evaluates delivery, and synthesizes coaching feedback.

## Progress Tracking (`/api/progress`)

- `GET /dashboard`: Aggregate statistics, historical score trends, WPM trends, and filler word rates.
- `GET /weak-areas`: Retrieve the user's weakest topics dynamically retrieved via Vector similarity search from past answers.

## Security Middleware

- **Rate Limiting**: Enforced on all routes (100 req/15min). Stricter limits applied to `/api/auth` (10 req/hr) and AI generation endpoints (50 req/hr).
- **Sanitization**: All request bodies are sanitized against NoSQL injections and XSS.
