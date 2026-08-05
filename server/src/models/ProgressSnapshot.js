const mongoose = require('mongoose');

const ProgressSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    avgWpm: {
      type: Number,
      default: 0,
    },
    avgFillerRate: {
      type: Number,
      default: 0,
    },
    avgContentScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0,
    },
    sessionRole: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProgressSnapshot', ProgressSnapshotSchema);
