import { asyncHandler } from '../utils/asyncHandler.js';
import { evaluationGraph } from '../ai/evaluationGraph.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import Session from '../models/Session.js';

/**
 * @desc    Generate the next AI interview question using the LangGraph pipeline
 * @route   POST /api/questions/generate
 * @access  Private
 */
export const generateQuestion = asyncHandler(async (req, res) => {
  const { sessionId, role, questionType } = req.body;

  if (!sessionId || !role || !questionType) {
    throw new ApiError(400, 'Missing required fields: sessionId, role, questionType');
  }

  // Fetch session to extract history for dynamic difficulty & contextualization
  const session = await Session.findById(sessionId);
  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  // Extract coaching feedback from past questions to feed into the question generator's RAG prompt
  const sessionHistory = session.questions
    .filter((q) => q.status === 'completed' && q.feedback)
    .map((q) => ({
      coachingReport:
        q.feedback.actionableTip || (q.feedback.improvements && q.feedback.improvements[0]) || '',
    }));

  const config = { configurable: { thread_id: sessionId } };

  // Trigger the start of the LangGraph pipeline
  // This runs `generateQuestionNode` and then pauses precisely at our `interruptBefore` breakpoint
  const result = await evaluationGraph.invoke(
    {
      role,
      questionType,
      sessionHistory,
      // Reset runtime fields for the new question cycle
      transcript: '',
      wordTimestamps: [],
      questionText: '',
    },
    config
  );

  // Extract the generated question from the paused graph state
  if (!result.questionText) {
    throw new ApiError(500, 'Failed to generate question from AI pipeline');
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { questionText: result.questionText }, 'Question generated successfully')
    );
});
