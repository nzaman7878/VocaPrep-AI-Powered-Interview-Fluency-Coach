import { llm } from '../llmClient.js';
import { coachSynthesisPrompt } from '../prompts/coachSynthesisPrompt.js';

/**
 * LangGraph Node: Coach Synthesis
 *
 * Takes the raw data from the Content and Delivery nodes and invokes the Gemini LLM
 * to synthesize a final, human-readable coaching report.
 * Maps the output to the precise schema required by the frontend.
 *
 * @param {Object} state - The current LangGraph InterviewEvaluationState
 * @returns {Object} Partial state update containing the `coachingReport` object
 */
export const synthesizeCoachingNode = async (state) => {
  const { contentEvaluation, deliveryEvaluation } = state;

  // Edge case: User skipped the question or audio failed (scores are 0)
  if (
    !contentEvaluation ||
    !deliveryEvaluation ||
    (contentEvaluation.score === 0 && deliveryEvaluation.score === 0)
  ) {
    return {
      coachingReport: {
        overallScore: 0,
        strengths: [],
        improvements: ['Ensure you provide a complete verbal answer.'],
        actionableTip:
          'Please ensure your microphone is working and try answering the question again.',
        encouragement:
          "Don't worry! Technical glitches happen, or maybe you just drew a blank. Keep going!",
      },
    };
  }

  const chain = coachSynthesisPrompt.pipe(llm);

  const response = await chain.invoke({
    contentScore: contentEvaluation.score,
    contentCorrectness: contentEvaluation.correctness,
    contentStructure: contentEvaluation.structure,
    contentCompleteness: contentEvaluation.completeness,
    contentFeedback: contentEvaluation.feedback,

    deliveryScore: deliveryEvaluation.score || 0,
    deliveryPacing: deliveryEvaluation.pacingScore || 0,
    deliveryFluency: deliveryEvaluation.fluencyScore || 0,
    deliveryFeedback: deliveryEvaluation.feedback || '',
  });

  let synthesis;
  try {
    let rawContent = response.content.trim();
    // Preemptively clean up markdown block hallucination
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```/, '').replace(/```$/, '').trim();
    }
    synthesis = JSON.parse(rawContent);
  } catch (error) {
    console.error('[CoachSynthesis] Failed to parse JSON response:', response.content);
    // Graceful degradation
    synthesis = {
      coachingReport: 'System successfully evaluated metrics, but AI synthesis failed.',
      strengths: ['Completed the recording'],
      areasToImprove: ['None identified due to system error.'],
    };
  }

  // Calculate the final overarching score as an average of content and delivery
  const cScore = contentEvaluation.score || 0;
  const dScore = deliveryEvaluation.score || 0;
  const overallScore = Math.round((cScore + dScore) / 2);

  // Map the prompt's schema to the strictly required node output schema
  return {
    coachingReport: {
      overallScore,
      strengths: synthesis.strengths || [],
      improvements: synthesis.areasToImprove || [],
      // Extract the first area to improve as the primary actionable tip
      actionableTip:
        synthesis.areasToImprove && synthesis.areasToImprove.length > 0
          ? synthesis.areasToImprove[0]
          : 'Keep practicing!',
      // Use the cohesive paragraph as the main encouragement/summary block
      encouragement: synthesis.coachingReport || 'Great effort on this question!',
    },
  };
};
