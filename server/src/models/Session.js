const mongoose = require('mongoose');

const QuestionAttemptSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  transcript: {
    type: String,
    default: '',
  },
  metrics: {
    wpm: { type: Number, default: 0 },
    fillers: { type: Number, default: 0 },
    pauses: { type: Number, default: 0 },
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
  },
  feedback: {
    type: String,
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

module.exports = mongoose.model('Session', SessionSchema);
