const mongoose = require('mongoose');

const weakAreaSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  accuracy: { type: Number, required: true } // percentage
});

const quizScoreSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true }
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  }],
  quizScores: [quizScoreSchema],
  weakAreas: [weakAreaSchema],
  recommendations: [{
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    reason: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
