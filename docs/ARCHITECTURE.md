# VocaPrep Architecture

VocaPrep uses a modern MERN stack combined with an agentic AI pipeline.

## System Components

1. **Frontend (React)**: Handles user interaction, Web Audio API recording, and visualization.
2. **Backend (Express)**: Manages authentication, database operations, audio proxying, and AI orchestration.
3. **LangGraph Pipeline**:
   - *Question Generator*: Pulls role context and past weaknesses to generate tailored questions.
   - *Content Evaluator*: Analyzes transcript for correctness and structure (STAR).
   - *Delivery Evaluator*: Computes WPM, filler word rates, and pauses from word-level timestamps.
   - *Coach Synthesis*: Combines content and delivery evaluations into actionable feedback.

## Graph Diagram

```mermaid
graph TD
    A[User selects role] --> B[Question Generator Agent]
    B --> C[User records voice answer]
    C --> D[Speech-to-Text: AssemblyAI]
    D --> E{Parallel evaluation}
    E --> F[Content Evaluator Agent]
    E --> G[Delivery Evaluator Agent]
    F --> H[Coach Synthesis Agent]
    G --> H
    H --> I[Combined Report shown to user]
```
