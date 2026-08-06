import ProgressSnapshot from '../models/ProgressSnapshot.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
