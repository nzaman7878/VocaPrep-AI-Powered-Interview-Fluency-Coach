import ProgressSnapshot from '../models/ProgressSnapshot.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { retrievalService } from '../services/retrievalService.js';

/**
 * @desc    Get user's progress snapshots (for dashboard charts)
 * @route   GET /api/progress
 * @access  Private
 */
export const getProgressSnapshots = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 30; // default to last 30 snapshots

  const snapshots = await ProgressSnapshot.find({ userId: req.user.id })
    .sort({ date: 1 }) // sort ascending by date for charts
    .limit(limit);

  res
    .status(200)
    .json(new ApiResponse(200, snapshots, 'Progress snapshots retrieved successfully'));
});

/**
 * @desc    Get aggregated stats for dashboard summary
 * @route   GET /api/progress/summary
 * @access  Private
 */
export const getProgressSummary = asyncHandler(async (req, res) => {
  // Aggregate data to find total questions answered, average wpm, average filler rate, etc.
  const stats = await ProgressSnapshot.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestionsAnswered' },
        avgWpm: { $avg: '$avgWpm' },
        avgFillerRate: { $avg: '$avgFillerRate' },
        avgContentScore: { $avg: '$avgContentScore' },
      },
    },
  ]);

  const summary =
    stats.length > 0
      ? stats[0]
      : { totalSessions: 0, totalQuestions: 0, avgWpm: 0, avgFillerRate: 0, avgContentScore: 0 };

  // Remove the _id field from the aggregated result
  if (summary._id !== undefined) {
    delete summary._id;
  }

  res.status(200).json(new ApiResponse(200, summary, 'Progress summary retrieved successfully'));
});

/**
 * @desc    Get weak areas using ChromaDB RAG
 * @route   GET /api/progress/weak-areas
 * @access  Private
 */
export const getWeakAreas = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 3;
  const weakAreasRaw = await retrievalService.getWeakAreas(req.user.id, limit);

  // Map the raw ChromaDB documents into a friendly format for the frontend
  const weakAreas = weakAreasRaw.map((area) => {
    const docText = area.document || '';
    
    // Attempt to extract the 'Areas for Improvement' from the embedded document string
    const improvementMatch = docText.match(/Areas for Improvement:\s*(.*)/);
    const feedbackText = improvementMatch ? improvementMatch[1] : docText.substring(0, 150) + '...';

    // Attempt to extract Question text to use as Topic
    const questionMatch = docText.match(/Question:\s*(.*)/);
    let topic = questionMatch ? questionMatch[1] : area.metadata.questionType;
    if (topic && topic.length > 60) topic = topic.substring(0, 60) + '...';

    return {
      id: area.id,
      score: area.metadata.contentScore,
      topic: topic || 'General Topic',
      feedback: feedbackText,
      role: area.metadata.role,
      date: area.metadata.date
    };
  });

  res.status(200).json(new ApiResponse(200, weakAreas, 'Weak areas retrieved successfully'));
});
