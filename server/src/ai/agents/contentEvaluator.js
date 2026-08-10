import { mistralLlm } from '../llmClient.js';
import { contentEvaluatorPrompt } from '../prompts/contentEvaluatorPrompt.js';

/**
 * LangGraph Node: Content Evaluator
 *
 * Invokes Mistral to evaluate the transcript content based on correctness,
 * structure (STAR method/logical flow), and completeness.
 *
 * @param {Object} state - The current LangGraph InterviewEvaluationState
 * @returns {Object} A partial state update appending the `contentEvaluation` object
 */
export const evaluateContentNode = async (state) => {
  const { role, questionType, questionText, transcript } = state;

  // Edge Case: If there's no transcript, return zero scores immediately
  if (!transcript || transcript.trim() === '') {
    return {
      contentEvaluation: {
        score: 0,
        correctness: 0,
        structure: 0,
        completeness: 0,
        strengths: [],
        improvements: ['No answer was provided.'],
        feedback: 'You did not provide an answer to this question.',
      },
    };
  }

  // Pipe the variables into the prompt and then to the LLM
  const chain = contentEvaluatorPrompt.pipe(mistralLlm);

  const response = await chain.invoke({
    role: role || 'Software Engineer',
    questionType: questionType || 'behavioral',
    questionText: questionText || 'Tell me about yourself.',
    transcript: transcript,
  });

  let parsedEvaluation;
  try {
    let rawContent = response.content.trim();

    // Safety check: Strip markdown formatting if the LLM wraps it despite instructions
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```/, '').replace(/```$/, '').trim();
    }

    parsedEvaluation = JSON.parse(rawContent);
  } catch (error) {
    console.error('[ContentEvaluator] Failed to parse JSON response:', response.content);
    // Graceful degradation fallback
    return {
      contentEvaluation: {
        score: 5,
        correctness: 5,
        structure: 5,
        completeness: 5,
        strengths: [],
        improvements: ['System failed to parse the AI evaluation.'],
        feedback: 'An error occurred while evaluating your response.',
      },
    };
  }

  // Extract the JSON fields as defined in our Prompt Template
  const {
    correctness = 0,
    structure = 0,
    completeness = 0,
    keyConceptsCovered = [],
    missingConcepts = [],
    feedback = '',
  } = parsedEvaluation;

  // Calculate an overall average score (out of 10)
  const score = Math.round((correctness + structure + completeness) / 3);

  // Return the mapped output schema
  return {
    contentEvaluation: {
      score,
      correctness,
      structure,
      completeness,
      strengths: keyConceptsCovered, // Map key concepts to strengths
      improvements: missingConcepts, // Map missing concepts to improvements
      feedback,
    },
  };
};
