# VocaPrep — AI-Powered Interview & Fluency Coach

_A voice-first, agentic AI interview simulator that evaluates both **what** you say and **how** you say it._

## Problem

Most interview-prep tools evaluate content only. None evaluate delivery: filler words, pacing, pauses, and confidence—which is where candidates often lose interviews despite knowing the right answer.

VocaPrep closes that gap: it's a voice-based mock interview platform where an AI pipeline evaluates content accuracy and speech delivery in the same session, tracking improvement over time. It utilizes Vector Embeddings and RAG (Retrieval-Augmented Generation) to analyze your weak points over time and tailor future questions specifically to help you improve.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Framer Motion
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (User & Session Data) + ChromaDB (Vector Embeddings & RAG)
- **State Management:** Redux Toolkit + React Context
- **AI Orchestration:** LangChain.js + LangGraph.js
- **LLM:** Google Gemini
- **Speech-to-Text:** AssemblyAI (Word-level timestamps for fluency tracking)

## Key Features

- **Agentic AI Pipeline**: Utilizes LangGraph for a multi-agent evaluation system (Content Evaluator, Delivery Evaluator, and Coach Synthesis).
- **Personalized RAG Interviews**: Embeds your past interview answers and feedback into ChromaDB to identify weak areas and generate highly personalized follow-up questions.
- **Fluency Metrics**: Calculates Words Per Minute (WPM), filler word rate, and identifies run-on sentences.
- **Performance Optimized**: Built with code-splitting (React.lazy), memoization (useMemo/useCallback), and DOM-level animation optimizations.
- **Secure**: Implements rate limiting (Global, Auth, and AI routes), Helmet, NoSQL injection sanitization, XSS protection, and HTTP parameter pollution prevention.
- **Accessible & Responsive**: Fully responsive UI with ARIA labels, focus management, and screen-reader support.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Docker (for ChromaDB)
- API Keys: AssemblyAI, Google Gemini, Cloudinary (optional for profile pics)

### Backend Setup

1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your keys.
4. Start ChromaDB using Docker: `docker-compose up -d`
5. Start the development server: `npm run dev`

### Frontend Setup

1. `cd client`
2. `npm install`
3. Copy `.env.example` to `.env` (ensure `VITE_API_URL` is set).
4. Start the frontend: `npm run dev`

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [E2E Test Checklist](docs/E2E_TEST_CHECKLIST.md)

## License

MIT License
