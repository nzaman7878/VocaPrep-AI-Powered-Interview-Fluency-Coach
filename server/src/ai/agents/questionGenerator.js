import { llm } from '../llmClient.js';
import { questionGeneratorPrompt } from '../prompts/questionGeneratorPrompt.js';

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
  const { role, questionType, sessionHistory } = state;

  // Dynamically scale difficulty based on how deep into the interview we are
  // Base difficulty is 3, increases slightly as the history grows (capped at 10)
  const difficulty = Math.min(10, 3 + (sessionHistory?.length || 0));

  // RAG Extraction: Extract weak areas from past coaching feedback if available
  let pastWeakAreas = 'None specifically identified yet.';
  if (sessionHistory && sessionHistory.length > 0) {
    const weakPoints = sessionHistory
      .map((pastNode) => pastNode.coachingReport)
      .filter(Boolean)
      .join('\n');

    if (weakPoints) {
      pastWeakAreas =
        'Prioritize testing improvement on these topics extracted from past feedback:\n' +
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
