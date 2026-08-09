import { Annotation } from '@langchain/langgraph';

/**
 * Defines the shared state schema that flows through the LangGraph evaluation pipeline.
 * Each node in the graph reads from and writes to this state structure.
 */
export const InterviewEvaluationState = Annotation.Root({
  // --- Pipeline Inputs ---
  userId: Annotation(),
  role: Annotation(),
  questionType: Annotation(), // e.g. 'behavioral', 'technical'
  questionText: Annotation(),
  transcript: Annotation(),
  wordTimestamps: Annotation(), // Array of { text, start, end, confidence }

  // --- Pipeline Outputs ---
  contentEvaluation: Annotation(), // Object containing relevance, STAR format validation, etc.
  deliveryEvaluation: Annotation(), // Object containing fluency, pacing, filler word analysis.
  coachingReport: Annotation(), // Final merged Markdown report for the user.

  // --- Contextual Memory ---
  sessionHistory: Annotation(), // Array of past interactions for RAG / contextual continuity.
});
