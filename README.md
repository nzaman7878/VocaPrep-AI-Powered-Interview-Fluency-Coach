# VocaPrep — AI-Powered Interview & Fluency Coach

*A voice-first, agentic AI interview simulator that evaluates both **what** you say and **how** you say it.*

## Problem
Most interview-prep tools evaluate content only. None evaluate delivery: filler words, pacing, pauses, and confidence—which is where candidates often lose interviews despite knowing the right answer.

VocaPrep closes that gap: it's a voice-based mock interview platform where an AI pipeline evaluates content accuracy and speech delivery in the same session, tracking improvement over time.

## Tech Stack
* **Frontend:** React 19 + Vite + Tailwind CSS v4
* **Backend:** Node.js + Express
* **Database:** MongoDB Atlas
* **State:** Redux Toolkit
* **AI Orchestration:** LangChain.js + LangGraph.js
* **LLM:** Google Gemini
* **Speech-to-Text:** AssemblyAI

## Setup Instructions
1. Install dependencies: `npm install`
2. Configure `.env` in `server/` and `client/` from `.env.example` templates.
3. Start development servers: `npm run dev`

## Documentation
* [Architecture Guide](docs/ARCHITECTURE.md)
* [API Documentation](docs/API.md)
