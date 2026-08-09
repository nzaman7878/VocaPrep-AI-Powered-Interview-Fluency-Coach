import { llm } from '../llmClient.js';
import { questionGeneratorPrompt } from '../prompts/questionGeneratorPrompt.js';
import { retrievalService } from '../../services/retrievalService.js';

/**
 * LangGraph Node: Question Generator
 *
 * Responsible for invoking the Gemini LLM with the context-aware prompt
 * to generate the next interview question.
 *
 * @param {Object} state - The current LangGraph InterviewEvaluationState
 * @returns {Object} A partial state update appending the generated `questionText`
 */
export const generateQuestionNode = async (state) => {
  const { userId, role, questionType, sessionHistory } = state;

  // Dynamically scale difficulty based on how deep into the interview we are
  const difficulty = Math.min(10, 3 + (sessionHistory?.length || 0));

  let pastWeakAreas = 'None specifically identified yet.';

  // 1. RAG Extraction: Try to fetch weakest past attempts from ChromaDB
  if (userId) {
    try {
      const weakDocs = await retrievalService.getWeakAreas(userId, 2);
      if (weakDocs && weakDocs.length > 0) {
        pastWeakAreas =
          'Prioritize testing improvement on these historical weak areas from past sessions:\n\n';
        pastWeakAreas += weakDocs
          .map((w, i) => `--- Past Attempt ${i + 1} ---\n${w.document}`)
          .join('\n\n');
      }
    } catch (error) {
      console.error('Error fetching weak areas for RAG:', error);
    }
  }

  // 2. Fallback to in-session weak points if vector store returned nothing
  if (
    pastWeakAreas === 'None specifically identified yet.' &&
    sessionHistory &&
    sessionHistory.length > 0
  ) {
    const weakPoints = sessionHistory
      .map((pastNode) => pastNode.coachingReport)
      .filter(Boolean)
      .join('\n');

    if (weakPoints) {
      pastWeakAreas =
        'Prioritize testing improvement on these topics extracted from recent feedback:\n' +
        weakPoints;
    }
  }

  // Pipe the formatted prompt into the Gemini client
  const chain = questionGeneratorPrompt.pipe(llm);

  const response = await chain.invoke({
    role: role || 'Software Engineer', // Fallback for safety
    questionType: questionType || 'behavioral',
    difficulty,
    pastWeakAreas,
  });

  // Return the partial state update
  // The LLM was instructed to output ONLY the question string
  return {
    questionText: response.content.trim(),
  };
};
