# 🎙️ VocaPrep: AI-Powered Interview & Fluency Coach

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.com/)
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](https://stripe.com/)

**VocaPrep** is a highly advanced, full-stack web application designed to act as a personal, AI-driven interview and fluency coach. It bridges the critical gap between technical competency and verbal articulation, providing candidates with a safe, simulated environment to practice and perfect their interview skills.

By leveraging state-of-the-art Large Language Models (LLMs) orchestrated via LangGraph, high-fidelity audio transcription, and vector-based semantic search, VocaPrep evaluates not just _what_ a user says (content relevance, STAR method adherence), but exactly _how_ they say it (fluency, pacing, and filler word detection).

---

## 📑 Comprehensive Table of Contents

1. [Project Overview and Core Philosophy](#project-overview-and-core-philosophy)
2. [Deep Dive into Key Features](#deep-dive-into-key-features)
   - [The Interview Simulator](#the-interview-simulator)
   - [The AI Evaluation Engine](#the-ai-evaluation-engine)
   - [Progress Tracking & Analytics](#progress-tracking--analytics)
   - [Monetization & Auth](#monetization--auth)
3. [Technology Stack & Architectural Justifications](#technology-stack--architectural-justifications)
4. [High-Level System Architecture (HLD)](#high-level-system-architecture-hld)
5. [Low-Level Design (LLD): The AI Pipeline](#low-level-design-lld-the-ai-pipeline)
6. [Frontend Client Architecture](#frontend-client-architecture)
   - [Redux State Management](#redux-state-management)
   - [Component Hierarchy](#component-hierarchy)
7. [Comprehensive Database Architecture](#comprehensive-database-architecture)
   - [User Schema](#user-schema)
   - [Session & QuestionAttempt Schema](#session--questionattempt-schema)
   - [ProgressSnapshot Schema](#progresssnapshot-schema)
8. [Authentication and Authorization Flow](#authentication-and-authorization-flow)
9. [Security Protocols & Error Handling](#security-protocols--error-handling)
10. [Complete Project Structure](#complete-project-structure)
11. [Exhaustive API Documentation](#exhaustive-api-documentation)
    - [Authentication Endpoints](#authentication-endpoints)
    - [User & Admin Profile](#user--admin-profile)
    - [Session Management](#session-management)
    - [AI Orchestration Endpoints](#ai-orchestration-endpoints)
    - [Progress & Analytics](#progress--analytics)
    - [Payment Processing](#payment-processing)
12. [Local Installation and Setup Guide](#local-installation-and-setup-guide)
13. [Environment Variables Dictionary](#environment-variables-dictionary)
14. [Development Workflow & Tooling](#development-workflow--tooling)
15. [Production Deployment Strategy](#production-deployment-strategy)
16. [Important Technical Decisions](#important-technical-decisions)
17. [Future Development Roadmap](#future-development-roadmap)

---

## 🎯 Project Overview and Core Philosophy

In today's competitive job market, exceptional technical skills or impressive resumes are often not enough to secure a role. Candidates frequently fail interviews due to poor articulation, heavy reliance on filler words, or failing to structure their answers effectively (e.g., missing the "Result" in the STAR method).

VocaPrep was built to solve this exact problem. Traditional interview preparation relies on speaking into a mirror or practicing with peers who may lack the expertise to provide constructive, objective feedback. VocaPrep replaces the mirror with a hyper-intelligent, objective AI coach.

The core philosophy of VocaPrep rests on three pillars:

1. **Realism:** Replicating the pressure of a real interview with dynamically generated, unpredictable questions tailored to the user's target role.
2. **Objectivity:** Using programmatic audio analysis to measure delivery metrics (Words Per Minute, Pause Lengths, Filler Rates) that human interviewers feel but cannot quantify.
3. **Actionability:** Transforming LLM insights into concise, actionable coaching tips rather than overwhelming the user with dense paragraphs of critique.

---

## 🚀 Deep Dive into Key Features

### The Interview Simulator

- **Dynamic Role-Based Generation:** Users specify their target role (e.g., "Senior React Developer", "Product Manager"). VocaPrep's `questionGenController` queries the LLM to generate highly specific, context-aware questions.
- **Multi-Modal Question Types:** The system intelligently rotates through `behavioral` (e.g., "Tell me about a time..."), `technical` (e.g., "Explain the virtual DOM..."), and `situational` questions to ensure a well-rounded practice session.
- **In-Browser Audio Recording:** A frictionless UI built with React and the Web Audio API captures high-fidelity audio streams, chunking them efficiently for backend processing.

### The AI Evaluation Engine

- **Parallel Processing Pipeline:** VocaPrep utilizes LangGraph to execute evaluation nodes in parallel. The `contentEvaluator` and `deliveryEvaluator` run concurrently, significantly reducing the turnaround time for user feedback.
- **Content Scoring:** The transcript is analyzed for semantic relevance, logical structuring (adherence to the Situation, Task, Action, Result framework), and professional tone.
- **Delivery Metrics:** By parsing the timestamps returned by the transcription service (AssemblyAI), the backend mathematically calculates the exact Words Per Minute (WPM), identifies the longest pause, and calculates a percentage "Filler Rate" to highlight verbal tics like "um", "ah", and "like".

### Progress Tracking & Analytics

- **Historical Snapshots:** Every completed session generates a `ProgressSnapshot`.
- **Visual Analytics:** The React frontend utilizes Recharts to map out the user's average content score and average filler rate over time, visually proving their improvement and gamifying the practice experience.
- **Weak Area Identification:** The system automatically aggregates recurring feedback (e.g., "speaking too fast") and updates the user's `weakAreas` array to focus future coaching.

### Monetization & Auth

- **Google OAuth:** One-click registration and login powered by `@react-oauth/google` on the client and `google-auth-library` on the server, ensuring users never have to remember another password.
- **Tiered Access via Stripe:** Integrated with the Stripe API to offer a "freemium" model. Free users are capped by `usageCount`, while subscribed users get unlimited interview generation.

---

## 🛠️ Technology Stack & Architectural Justifications

### Frontend Client

| Technology                   | Justification                                                                                                                                                                 |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 19 & Vite**          | Vite provides near-instant Hot Module Replacement (HMR) and highly optimized production builds compared to Create React App. React 19 provides concurrent rendering features. |
| **Tailwind CSS v4**          | Utility-first styling allows for rapid UI iteration without context-switching between JS and CSS files.                                                                       |
| **Redux Toolkit**            | Centralized state management is critical for persisting the complex state of an active interview session across different views without prop-drilling.                        |
| **React Router v7**          | Enables seamless client-side routing, protected route wrappers, and complex nested layouts (e.g., Dashboard vs. Interview Room).                                              |
| **Recharts & Framer Motion** | Essential for providing the user with visually engaging, animated feedback charts and smooth UI transitions that reduce cognitive load.                                       |

### Backend Server

| Technology                | Justification                                                                                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js & Express.js**  | Non-blocking, event-driven architecture is ideal for handling asynchronous I/O operations like audio uploads, network requests to LLMs, and database queries.                                          |
| **MongoDB & Mongoose**    | The flexible schema nature of NoSQL perfectly accommodates the deeply nested and sometimes variable nature of AI feedback objects and interview transcripts.                                           |
| **LangChain & LangGraph** | Provides a standardized abstraction layer over LLMs (Gemini/Mistral). LangGraph specifically enables us to orchestrate complex, branching AI workflows (StateGraphs) rather than simple linear chains. |
| **ChromaDB**              | A lightweight vector database used to store role-specific contexts, allowing the LLM to perform Retrieval-Augmented Generation (RAG) when evaluating highly technical answers.                         |
| **Stripe API**            | The industry standard for handling secure, PCI-compliant subscription lifecycle management and webhook event processing.                                                                               |
| **AssemblyAI**            | Superior transcription accuracy compared to native Web Speech API, offering exact millisecond word-level timestamps crucial for pace calculations.                                                     |

---

## 🏗️ High-Level System Architecture (HLD)

The architecture is designed to decouple heavy AI processing from the core request-response cycle where possible, ensuring a responsive user interface.

```mermaid
graph TD
    %% Define Nodes
    Client[React Client SPA]
    Express[Express.js Node Server]
    Mongo[(MongoDB - Primary DB)]
    Chroma[(ChromaDB - Vector Store)]
    AssemblyAI[AssemblyAI API]
    LangGraph[LangGraph Orchestrator]
    LLM[Gemini / Mistral LLM API]
    Stripe[Stripe Billing]
    Cloudinary[Cloudinary Audio Storage]

    %% Define Relationships
    Client -->|1. POST Audio / REST HTTPs| Express
    Express -->|2. Buffer Upload| Cloudinary
    Express -->|3. Trigger Transcription| AssemblyAI
    AssemblyAI --|4. Return Transcript & Timestamps| Express

    Express -->|5. Initialize StateGraph| LangGraph
    LangGraph <-->|6. Fetch Role Context| Chroma
    LangGraph <-->|7. Parallel Evaluation Prompts| LLM

    LangGraph --|8. Return Unified Coaching Report| Express
    Express -->|9. Persist Session Data| Mongo
    Express --|10. Return Feedback JSON| Client

    %% Side Processes
    Express <-->|Webhooks & Checkout| Stripe
    Client <-->|Token Exchange| Express
```

---

## 🧠 Low-Level Design (LLD): The AI Pipeline

VocaPrep's AI engine is not a simple "prompt and response" system. It utilizes `@langchain/langgraph` to construct a stateful Directed Acyclic Graph (DAG) for processing.

### The Graph State (`graphState.js`)

All nodes in the AI pipeline share a strictly typed state object defined via LangGraph's `Annotation.Root`. This state contains:

- **Inputs:** `userId`, `role`, `questionType`, `questionText`, `transcript`, `wordTimestamps`.
- **Outputs:** `contentEvaluation`, `deliveryEvaluation`, `coachingReport`.
- **Context:** `sessionHistory` for ensuring the AI remembers previous feedback given to the user within the same interview.

### The Node Execution Flow (`evaluationGraph.js`)

To minimize latency, the evaluation splits into a **FAN-OUT** architecture.

```mermaid
sequenceDiagram
    participant Start as [START]
    participant Content as Content Evaluator Node
    participant Delivery as Delivery Evaluator Node
    participant Synthesis as Coach Synthesis Node
    participant End as [END]

    Start->>Content: Pass Transcript & Question
    Start->>Delivery: Pass Timestamps & Transcript

    note over Content,Delivery: Nodes execute in PARALLEL via Promise.all under the hood of LangGraph

    Content-->>Synthesis: Return Content Score & Relevance (FAN-IN)
    Delivery-->>Synthesis: Return WPM & Filler Count (FAN-IN)

    note over Synthesis: Synthesizes technical and delivery flaws into a single Markdown coaching report

    Synthesis->>End: Finalize State
```

---

## 🖥️ Frontend Client Architecture

The frontend is a strictly typed (via JSDoc) React Single Page Application (SPA) designed for extreme modularity.

### Redux State Management

The global state is divided into logical slices to prevent unnecessary re-renders:

- `authSlice`: Stores the current JWT, user profile data (name, email, avatar, subscription status), and manages the loading state during initial application bootstrap.
- `sessionSlice`: Manages the active interview room. Stores the current generated question, the countdown timer state, and the array of `QuestionAttempt` objects from the backend.
- `progressSlice`: Caches the historical chart data retrieved from the backend to instantly render the Dashboard upon navigation.

### Component Hierarchy

The UI leverages composition to build complex views. For example, the `InterviewRoom` page is composed of:

- `WebcamPreview`: Displays a local mirror of the user (without uploading video) to simulate interview pressure.
- `AudioRecorder`: Wraps the native `MediaRecorder` API to capture microphone input, emitting `onStart`, `onStop`, and `onUpload` events.
- `QuestionPrompt`: Displays the current AI-generated question and toggles to a loading skeleton when a new question is being fetched.
- `FeedbackModal`: A slide-over panel powered by Framer Motion that displays the LangGraph coaching report after an answer is submitted.

---

## 🗄️ Comprehensive Database Architecture

The database is normalized across three primary collections to separate authentication, active processing, and historical analytics. Indexes are carefully applied to ensure rapid querying.

### User Schema (`User.js`)

Handles identity, billing, and global preferences.

- `_id`: ObjectId
- `name`: String (Required, min 2 chars)
- `email`: String (Required, unique, regex validated)
- `googleId`: String (Sparse, unique index)
- `avatar`: String (URL to profile picture)
- `targetRole`: String (Enum mapped to shared `ROLES` array)
- `weakAreas`: Array of Strings (e.g., ["speaking rate", "eye contact"])
- `stripeCustomerId` & `stripeSubscriptionId`: Strings
- `subscriptionStatus`: Enum (`free`, `active`, `past_due`, `canceled`)
- `usageCount`: Number (Tracks free tier limits)
- `role`: Enum (`user`, `admin`) (Default: `user`)

### Session & QuestionAttempt Schema (`Session.js`)

A `Session` acts as a container for an interview. It contains an array of `QuestionAttempt` sub-documents.

- **Session:**
  - `userId`: ObjectId (Ref: User, **Indexed** for quick fetching of user history)
  - `role`: String (The role being interviewed for during this session)
  - `status`: Enum (`in_progress`, `completed`, `abandoned`)
  - `startedAt`: Date
  - `completedAt`: Date
  - `totalQuestions`: Number
  - `questions`: [QuestionAttemptSchema]
- **QuestionAttempt (Embedded):**
  - `questionText`: String
  - `questionType`: Enum (`technical`, `behavioral`, `situational`)
  - `transcript`: String (The exact words spoken)
  - `audioUrl`: String (Cloudinary link)
  - `contentScore`: Number (0-10)
  - `deliveryMetrics`: Object containing `wpm`, `fillerCount`, `fillerRate`, `pauseCount`, `avgPauseLength`, `longestPause`
  - `feedback`: Mixed Object (The synthesized LangGraph output)
  - `answeredAt`: Date

### ProgressSnapshot Schema (`ProgressSnapshot.js`)

Generated asynchronously upon session completion for fast analytics querying, preventing the need to aggregate all historical sessions on every dashboard load.

- `userId`: ObjectId (Ref: User, **Indexed**)
- `sessionId`: ObjectId (Ref: Session)
- `date`: Date (**Indexed** for time-series charts)
- `avgWpm`: Number
- `avgFillerRate`: Number
- `avgContentScore`: Number
- `totalQuestionsAnswered`: Number

---

## 🔒 Authentication and Authorization Flow

VocaPrep implements a highly secure, hybrid authentication strategy to maximize user convenience without sacrificing API security.

1. **Client-Side Google Auth:** The React client utilizes the `@react-oauth/google` provider to render a secure Google Login button. Upon clicking, the user authenticates directly with Google, and the client receives a Google JWT credential.
2. **Backend Verification:** The client POSTs this credential to `/api/auth/google`. The Express server uses the official `google-auth-library` to cryptographically verify the signature of the token against Google's public keys, ensuring it wasn't spoofed.
3. **Database Sync:** The server extracts the email and `googleId`. If the user exists, they are fetched. If not, a new User document is provisioned with default free-tier limits.
4. **Custom JWT Issuance:** The Express server generates a custom JWT signed with the application's `JWT_SECRET`. This token contains the user's internal MongoDB `_id` and role (`user` or `admin`).
5. **API Protection:** All subsequent requests from the React client must include this custom JWT in the `Authorization: Bearer <token>` header. The Express `auth` middleware (`server/src/middleware/auth.js`) decodes this token, attaches the user object to `req.user`, and permits access to protected routes.

---

## 🛡️ Security Protocols & Error Handling

VocaPrep was built with enterprise-grade security in mind, employing multiple layers of middleware to protect the Express backend from common attack vectors.

### Security Middleware

- **Helmet (`helmet`):** Secures HTTP headers by hiding `X-Powered-By`, enabling HSTS, and setting strict Content Security Policies.
- **Rate Limiting (`express-rate-limit`):** Global rate limiters prevent brute-force attacks and DDOS attempts. Specific endpoints (like `/evaluation/evaluate`) have stricter limits to prevent LLM credit abuse.
- **Data Sanitization (`express-mongo-sanitize`):** Prevents NoSQL injection by recursively removing any keys starting with `$` or `.` from `req.body`, `req.query`, and `req.params`.
- **XSS Protection (`xss-clean`):** Sanitizes user input to prevent Cross-Site Scripting (XSS) attacks before they hit the database.
- **Parameter Pollution (`hpp`):** Protects against HTTP Parameter Pollution attacks that could crash the Node process by passing arrays where strings are expected.

### Global Error Handling

All routes are wrapped in an `asyncHandler` utility. If any Controller throws an error (or a Promise rejects), it is caught by the `errorHandler` middleware. The backend always responds with a standardized `ApiResponse` object format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid audio blob provided",
  "errors": ["File must be .webm or .wav"]
}
```

---

## 📁 Complete Project Structure

VocaPrep is structured as a monorepo utilizing npm workspaces, enabling seamless management of the client, server, and shared assets.

```text
VocaPrep/
├── client/                     # Frontend Application
│   ├── package.json            # Client dependencies (React, Vite, Redux)
│   ├── vite.config.ts          # Vite bundler configuration
│   └── src/
│       ├── components/         # Atomic UI components (Buttons, Modals, Cards)
│       ├── pages/              # High-level views (Dashboard, Interview, Profile)
│       ├── store/              # Redux configuration and slices
│       ├── utils/              # Axios instances, formatters, helpers
│       ├── App.jsx             # Root React component and Router
│       └── main.jsx            # React DOM injection point
├── server/                     # Backend API & AI Engine
│   ├── package.json            # Server dependencies (Express, Langchain, Mongoose)
│   ├── src/
│   │   ├── ai/                 # Core AI Logic
│   │   │   ├── agents/         # Specific LangGraph node implementations
│   │   │   ├── prompts/        # System prompts and templates for LLMs
│   │   │   ├── evaluationGraph.js # The compiled LangGraph workflow
│   │   │   ├── graphState.js   # The shared state schema annotation
│   │   │   └── llmClient.js    # Standardized Langchain model initialization
│   │   ├── config/             # DB connection, Stripe init, Cloudinary setup
│   │   ├── controllers/        # Express route handlers containing business logic
│   │   ├── middleware/         # Security (Helmet), Auth validation, Multer
│   │   ├── models/             # Mongoose schemas (User, Session, Progress)
│   │   ├── routes/             # Express Router definitions linking to controllers
│   │   ├── services/           # Wrappers for external APIs (AssemblyAI, Token)
│   │   ├── utils/              # Error handlers, async wrappers, logger
│   │   └── server.js           # Express application entry point
├── shared/                     # Cross-boundary constants
│   └── roles.js                # Shared enums ensuring Client and Server stay synced
├── .env.example                # Template for environment variables
├── package.json                # Root monorepo configuration and concurrently scripts
└── README.md                   # This exhaustive documentation file
```

---

## 📡 Exhaustive API Documentation

All endpoints are prefixed with `http://localhost:5000/api`. Below is a detailed breakdown of critical endpoints.

### Authentication Endpoints

#### `POST /auth/google`

- **Description:** Exchanges a Google OAuth token for a custom VocaPrep JWT.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "token": "eyJhbGciOiJSUzI1NiIsImtp..."
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": { "_id": "60d...", "name": "John Doe", "email": "john@example.com" },
      "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    },
    "message": "Authentication successful",
    "success": true
  }
  ```

### User & Admin Profile

#### `GET /user/profile`

- **Description:** Fetches the authenticated user's current profile, including usage counts and active subscription status.
- **Access:** Private
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "name": "John Doe",
      "targetRole": "frontend_developer",
      "usageCount": 2,
      "subscriptionStatus": "free",
      "weakAreas": ["Filler Words"]
    },
    "message": "User profile retrieved successfully",
    "success": true
  }
  ```

#### `GET /admin/dashboard-stats`

- **Description:** Returns global aggregate stats for the admin panel (total users, total sessions, revenue).
- **Access:** Private (Admin Only)

### Session Management

#### `POST /session/start`

- **Description:** Initializes a new interview session and determines the user's role.
- **Access:** Private (Requires Bearer Token)
- **Request Body:**
  ```json
  {
    "role": "frontend_developer"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "sessionId": "64b...",
      "status": "in_progress"
    },
    "message": "Session started successfully",
    "success": true
  }
  ```

#### `PUT /session/:id/complete`

- **Description:** Marks a session as `completed` and triggers the asynchronous generation of a `ProgressSnapshot`.
- **Access:** Private
- **URL Parameters:** `id` (Session ID)

### AI Orchestration Endpoints

#### `POST /questions/generate`

- **Description:** Utilizes the LLM and the session's history to generate the next appropriate interview question.
- **Access:** Private
- **Request Body:**
  ```json
  {
    "sessionId": "64b...",
    "role": "frontend_developer",
    "questionType": "technical"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "questionText": "Can you explain the difference between a controlled and uncontrolled component in React?"
    },
    "message": "Question generated successfully",
    "success": true
  }
  ```

#### `POST /evaluation/evaluate`

- **Description:** The core endpoint. Uploads audio, triggers transcription, runs the LangGraph evaluation pipeline, and updates the session.
- **Access:** Private
- **Headers:** `Content-Type: multipart/form-data`
- **Form Data:**
  - `audio`: The recorded audio Blob (File)
  - `sessionId`: String (Session ID)
  - `questionText`: String (The prompt provided to the user)
  - `questionType`: String (`behavioral`, `technical`, etc.)
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "transcript": "Well um a controlled component is driven by state...",
      "deliveryMetrics": {
        "wpm": 115,
        "fillerCount": 3,
        "fillerRate": 12.5,
        "longestPause": 3.2
      },
      "feedback": {
        "score": 7,
        "strengths": ["Accurate definition"],
        "improvements": ["You used 'um' frequently at the start"],
        "actionableTip": "Take a silent breath before answering instead of using filler words."
      }
    },
    "message": "Evaluation complete",
    "success": true
  }
  ```

### Progress & Analytics

#### `GET /progress/summary`

- **Description:** Retrieves the user's lifetime aggregate statistics from their historical `ProgressSnapshot` documents.
- **Access:** Private
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "totalSessions": 12,
      "avgContentScore": 8.2,
      "avgWpm": 130,
      "recentSnapshots": [ ... ]
    },
    "message": "Progress summary retrieved",
    "success": true
  }
  ```

### Payment Processing

#### `POST /stripe/create-checkout-session`

- **Description:** Generates a secure Stripe Checkout URL for purchasing a premium subscription.
- **Access:** Private

#### `POST /stripe/webhook`

- **Description:** Receives incoming events directly from Stripe servers to automatically update user subscription statuses upon successful payment or cancellation.
- **Access:** Public (Webhook signature verified in middleware)

---

## 💻 Local Installation and Setup Guide

Follow these comprehensive instructions to get VocaPrep running on your local machine.

### System Prerequisites

1. **Node.js:** Ensure you are running Node.js version 18 or higher (`node -v`).
2. **MongoDB:** Have a local MongoDB instance running (port 27017) or have a MongoDB Atlas connection string ready.
3. **API Keys:** You will need to register for developer accounts and obtain keys for:
   - Google Cloud Console (OAuth Client ID)
   - AssemblyAI (Transcription)
   - Stripe (Payments)
   - Cloudinary (File storage)
   - Gemini / Mistral (LLM access)

### Step-by-Step Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/VocaPrep.git
   cd VocaPrep
   ```

2. **Install Monorepo Dependencies:**
   Because this project uses npm workspaces, a single install command at the root will automatically resolve and link dependencies for both the `client` and `server`.

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   You must create two `.env` files.
   - Navigate to the `server/` directory, create a `.env` file, and populate it using the template provided in the next section.
   - Navigate to the `client/` directory, create a `.env` file, and set your Vite environment variables.

4. **Start the Development Servers:**
   From the root of the project, run the concurrently script:

   ```bash
   npm run dev
   ```

   _This command leverages the `concurrently` package to start the Nodemon backend server on Port 5000 and the Vite frontend server on Port 5173 simultaneously._

5. **Verify Installation:**
   Open your browser and navigate to `http://localhost:5173`. You should see the VocaPrep landing page and be able to authenticate using Google OAuth.

---

## 🔑 Environment Variables Dictionary

### Server (`server/.env`)

These variables are critical for backend functionality and must never be committed to source control.

| Variable Name           | Description                                                           | Example                              |
| :---------------------- | :-------------------------------------------------------------------- | :----------------------------------- |
| `PORT`                  | The port the Express server listens on.                               | `5000`                               |
| `MONGODB_URI`           | The connection string for your MongoDB database.                      | `mongodb://localhost:27017/vocaprep` |
| `JWT_SECRET`            | A long, cryptographically secure string used to sign JWTs.            | `super_secret_string_123`            |
| `GEMINI_API_KEY`        | API key for Google's Gemini LLM (via Langchain).                      | `AIzaSyB...`                         |
| `ASSEMBLYAI_API_KEY`    | API key for generating high-accuracy transcripts and word timestamps. | `abc123def456...`                    |
| `CLOUDINARY_URL`        | Cloudinary connection string for uploading audio blobs.               | `cloudinary://key:secret@name`       |
| `CHROMA_URL`            | The URL of your ChromaDB vector store instance.                       | `http://localhost:8000`              |
| `STRIPE_SECRET_KEY`     | Secret key for processing Stripe payments.                            | `sk_test_...`                        |
| `STRIPE_WEBHOOK_SECRET` | Secret key to verify incoming webhook signatures.                     | `whsec_...`                          |
| `ADMIN_EMAIL`           | The email address granted administrative privileges in the system.    | `admin@vocaprep.com`                 |

### Client (`client/.env`)

Variables prefixed with `VITE_` are exposed to the client-side bundle.

| Variable Name            | Description                                   | Example                                  |
| :----------------------- | :-------------------------------------------- | :--------------------------------------- |
| `VITE_API_URL`           | The base URL pointing to the Express backend. | `http://localhost:5000/api`              |
| `VITE_GOOGLE_CLIENT_ID`  | Your Google OAuth App Client ID.              | `12345-abcde.apps.googleusercontent.com` |
| `VITE_STRIPE_PUBLIC_KEY` | Publishable key for Stripe Elements.          | `pk_test_...`                            |

---

## ⚙️ Development Workflow & Tooling

VocaPrep maintains high code quality standards through strict development workflows.

- **Husky & Lint-Staged:** Pre-commit hooks are configured via Husky. When you attempt to commit code, `lint-staged` intercepts the commit to run ESLint and Prettier exclusively on staged files. If the linter fails, the commit is aborted, ensuring broken code never makes it to the main branch.
- **ESLint Configurations:** Custom rules are applied to both the React frontend (enforcing Hooks rules) and the Node backend (enforcing ES module imports).
- **Concurrent Development:** The root `package.json` contains a `"dev"` script utilizing `concurrently`. This allows a single terminal window to stream the logs of both the Vite client and the Express backend simultaneously, color-coding them for readability.
- **Prettier Code Formatting:** A global `.prettierrc` ensures uniform code styling (e.g., single quotes, trailing commas) across all workspaces.

---

## 🌍 Production Deployment Strategy

Deploying VocaPrep requires separate strategies for the client, server, and associated databases.

### 1. Database and Vector Store Deployment

- **MongoDB:** It is highly recommended to use **MongoDB Atlas** for production. Provision a cluster, whitelist your backend IP addresses, and obtain a secure connection string.
- **ChromaDB:** Deploy a ChromaDB instance using Docker on a virtual private server (e.g., AWS EC2, DigitalOcean Droplet) or use a managed vector database provider.

### 2. Backend API (Express.js) Deployment

The Node.js server can be deployed to Platform-as-a-Service (PaaS) providers like **Render**, **Railway**, or **Heroku**.

- Ensure the Build Command is `npm install` (target the server workspace).
- Ensure the Start Command is `npm start` (which maps to `node src/server.js`).
- Inject all production `.env` variables into the PaaS dashboard.
- _Critical:_ Ensure your hosting provider supports file system writes (or `/tmp` directory access) for the temporary Multer audio files before they are streamed to Cloudinary.

### 3. Frontend (React/Vite) Deployment

The client application should be compiled to static assets and deployed to a CDN-backed static host like **Vercel**, **Netlify**, or **Cloudflare Pages**.

- Set the Build Command to `npm run build`.
- Set the Output Directory to `client/dist`.
- Set the `VITE_API_URL` environment variable to point to your live, deployed Backend API URL.

---

## ⚖️ Important Technical Decisions

### Why LangGraph over Standard LangChain?

While standard LangChain is excellent for linear prompt chains, interview evaluation is inherently branching and stateful. We chose **LangGraph** because it allows us to define the evaluation process as a state machine. This enables **Parallel Node Execution**—the `contentEvaluator` and `deliveryEvaluator` nodes process the transcript simultaneously, drastically reducing the time the user spends waiting for the loading spinner after answering a question. This parallel execution is achieved without complex `Promise.all` logic inside controller code, maintaining clean architectural boundaries.

### Why Server-Side Audio Processing?

We explicitly decided against performing client-side speech recognition (e.g., via the Web Speech API). The Web Speech API is highly inconsistent across browsers (Safari vs. Chrome) and fails to provide accurate, word-level timestamps required for strict metric calculations (WPM and exact pause lengths). By offloading audio to AssemblyAI on the backend, we guarantee consistent, high-fidelity transcription and granular timestamp data regardless of the user's device, operating system, or browser choice.

### Why Redux Toolkit over Context API?

The Interview Room requires complex state management involving audio recording states, timer countdowns, websocket connections, and nested question data. While React Context is sufficient for simple themes or auth states, it triggers unnecessary re-renders across the entire component tree whenever the context value changes. Redux Toolkit provides granular subscriber updates, ensuring that a timer ticking down doesn't re-render the entire video preview and audio recording UI tree, thereby preserving framerate and UI responsiveness.

### Why Monorepo Workspace Strategy?

Instead of creating two entirely detached repositories for frontend and backend, we opted for a monorepo setup using standard NPM Workspaces. This allows us to have a `shared` directory containing Enums and Types (like user Roles) that are imported natively by both the backend API and the frontend components. This eliminates out-of-sync bugs where the backend expects a specific role string that the frontend has renamed.

---

## 🔭 Future Development Roadmap

VocaPrep is constantly evolving. The current roadmap includes the following major feature implementations:

1. **Video Analysis Integration:**
   - _Goal:_ Expand beyond audio to analyze non-verbal cues.
   - _Implementation:_ Integrate WebRTC video recording and computer vision APIs to evaluate eye contact, posture, and facial expressions during the interview, providing holistic body-language coaching.

2. **Custom Resume Context (RAG):**
   - _Goal:_ Personalize the interview questions based on the candidate's actual experience.
   - _Implementation:_ Allow users to upload their PDF resumes. The backend will chunk and embed the resume into ChromaDB, allowing the `questionGenController` to execute prompts like, "I see you used React at Company X. Can you explain a challenge you faced there?"

3. **Enterprise B2B Dashboard:**
   - _Goal:_ Allow coding bootcamps and universities to manage their students.
   - _Implementation:_ Create an Organization Schema, allowing administrative accounts to provision user seats and view aggregate progress snapshots of an entire cohort of users.

4. **Websocket-Based Real-time Interviews:**
   - _Goal:_ Reduce the latency between question generation and audio delivery, simulating true human conversation flow.
   - _Implementation:_ Migrate the REST-based `/evaluate` endpoint to a bidirectional WebSocket connection to stream transcripts and AI feedback in real-time.

---

_Thank you for exploring VocaPrep. For contributions, please read the `CONTRIBUTING.md` guidelines or open an issue in the repository._
