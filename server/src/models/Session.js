import mongoose from 'mongoose';

const QuestionAttemptSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['technical', 'behavioral', 'situational'],
    required: true,
  },
  transcript: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: '',
  },
  contentScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  deliveryMetrics: {
    wpm: { type: Number, default: 0 },
    fillerCount: { type: Number, default: 0 },
    fillerRate: { type: Number, default: 0 },
    pauseCount: { type: Number, default: 0 },
    avgPauseLength: { type: Number, default: 0 },
    longestPause: { type: Number, default: 0 },
  },
  feedback: {
    type: String,
  },
  contentFeedback: {
    type: String,
  },
  deliveryFeedback: {
    type: String,
  },
  answeredAt: {
    type: Date,
    default: Date.now,
  },
});

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    questions: [QuestionAttemptSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Session', SessionSchema);
