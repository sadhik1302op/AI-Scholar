const express = require('express');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Helper to calculate Level from XP
const calculateLevel = (xp) => {
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  return Math.floor(xp / 150) + 1;
};

// Get User Progress & Gamification Stats
router.get('/me', protect, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ userId: req.user._id }).populate('completedLessons');
    const user = await User.findById(req.user._id).select('level xpPoints badges');
    
    res.json({ progress, stats: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark Lesson Completed
router.post('/lesson', protect, async (req, res) => {
  const { lessonId } = req.body;
  try {
    let progress = await UserProgress.findOne({ userId: req.user._id });
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      await progress.save();

      // Gamification: +10 XP
      const user = await User.findById(req.user._id);
      user.xpPoints += 10;
      user.level = calculateLevel(user.xpPoints);
      
      if (!user.badges.includes('AI Beginner') && user.xpPoints >= 50) {
        user.badges.push('AI Beginner');
      }
      await user.save();
    }
    
    res.json({ message: 'Lesson marked as complete', xpAdded: 10 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit Quiz
router.post('/quiz', protect, async (req, res) => {
  const { quizId, answers } = req.body; // answers: { "questionId": "selectedOptionIndex" }
  try {
    const quiz = await Quiz.findById(quizId);
    let score = 0;
    
    quiz.questions.forEach((q, index) => {
      if (answers[q._id] === q.correctOptionIndex) {
        score += 1;
      }
    });

    // Update Progress
    let progress = await UserProgress.findOne({ userId: req.user._id });
    const existingScoreIndex = progress.quizScores.findIndex(q => q.quizId.toString() === quizId);
    if (existingScoreIndex > -1) {
      progress.quizScores[existingScoreIndex].score = Math.max(progress.quizScores[existingScoreIndex].score, score);
    } else {
      progress.quizScores.push({ quizId, score, maxScore: quiz.questions.length });
    }

    // Logic for weak areas (simplistic: if score < 50%, add quiz topic as weak area)
    const accuracy = (score / quiz.questions.length) * 100;
    if (accuracy < 60) {
      const existingWeakArea = progress.weakAreas.find(w => w.topic === quiz.title);
      if (existingWeakArea) existingWeakArea.accuracy = accuracy;
      else progress.weakAreas.push({ topic: quiz.title, accuracy });
    }

    await progress.save();

    // Gamification: +5 XP per correct answer
    const user = await User.findById(req.user._id);
    const xpGained = score * 5;
    user.xpPoints += xpGained;
    user.level = calculateLevel(user.xpPoints);
    if (!user.badges.includes('Quiz Master') && score === quiz.questions.length) {
      user.badges.push('Quiz Master');
    }
    await user.save();

    res.json({ score, maxScore: quiz.questions.length, xpGained, newLevel: user.level, badges: user.badges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
