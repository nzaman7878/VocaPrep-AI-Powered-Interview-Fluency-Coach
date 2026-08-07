import { evaluationGraph } from '../ai/evaluationGraph.js';
import Session from '../models/Session.js';
import ApiError from '../utils/ApiError.js';

class EvaluationService {
  /**
   * Orchestrates the LangGraph evaluation pipeline for a given answer.
   *
   * @param {string} sessionId - The database ID of the current interview session
   * @param {string} attemptId - The database ID of the specific question attempt (from the questions array)
   * @param {Object} data - The evaluation payload containing `transcript` and `wordTimestamps`
   * @returns {Object} The complete structured evaluation result
   */
  async evaluateAnswer(sessionId, attemptId, data) {
    const { transcript, wordTimestamps } = data;

    // 1. Fetch the session and the specific question attempt from the database
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    const questionAttempt = session.questions.id(attemptId);
    if (!questionAttempt) {
      throw new ApiError(404, 'Question attempt not found in session');
    }

    // 2. Prepare the thread configuration for LangGraph
    // This allows LangGraph to persist state for this specific interview session across multiple turns
    const config = { configurable: { thread_id: sessionId } };

    // Format the past transcript history for RAG context in the AI pipeline
    const sessionHistory = session.questions
      .filter((q) => q.transcript && q.transcript.length > 0)
      .map((q) => ({
        q: q.questionText,
        a: q.transcript,
      }));

    // 3. Inject the context into the graph state and invoke the pipeline.
    // If the graph was paused at the `interruptBefore` breakpoint (waiting for audio),
    // passing this new state will prime it for resumption.
    let result = await evaluationGraph.invoke(
      {
        role: session.role,
        questionType: questionAttempt.questionType,
        questionText: questionAttempt.questionText,
        transcript,
        wordTimestamps,
        sessionHistory,
      },
      config
    );

    // Check if the graph paused at the interrupt (before the parallel evaluators).
    // If it did, we immediately resume it by passing `null`, which tells LangGraph
    // to continue execution using the state we just injected above.
    const currentState = await evaluationGraph.getState(config);
    if (currentState.next && currentState.next.length > 0) {
      result = await evaluationGraph.invoke(null, config);
    }

    // 4. Extract the cleanly computed evaluations from the final LangGraph state
    const { contentEvaluation, deliveryEvaluation, coachingReport } = result;

    // 5. Update the MongoDB document with the new metrics and rich JSON feedback
    questionAttempt.transcript = transcript;
    questionAttempt.contentScore = contentEvaluation?.score || 0;

    // Map the deterministic delivery metrics
    if (deliveryEvaluation) {
      questionAttempt.deliveryMetrics = {
        wpm: deliveryEvaluation.wpm || 0,
        fillerCount: deliveryEvaluation.fillerCount || 0,
        fillerRate: deliveryEvaluation.fillerRate || 0,
        pauseCount: deliveryEvaluation.pauseCount || 0,
        avgPauseLength: deliveryEvaluation.avgPauseLength || 0,
        longestPause: deliveryEvaluation.longestPause || 0,
      };
    }

    // Store the raw structured JSON directly into the Mixed type fields
    questionAttempt.contentFeedback = contentEvaluation;
    questionAttempt.deliveryFeedback = deliveryEvaluation;
    questionAttempt.feedback = coachingReport;

    await session.save();

    // 6. Return the rich objects to the API caller (frontend)
    return {
      contentEvaluation,
      deliveryEvaluation,
      coachingReport,
    };
  }
}

export default new EvaluationService();
