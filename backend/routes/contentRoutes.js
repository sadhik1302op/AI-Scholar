const express = require('express');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// --- PUBLIC/STUDENT ROUTES ---

// Get all modules
router.get('/modules', async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get lessons for a module
router.get('/modules/:moduleId/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ moduleId: req.params.moduleId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get quiz for a lesson
router.get('/quizzes/:lessonId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- ADMIN ROUTES ---

// Create Module
router.post('/admin/modules', protect, admin, async (req, res) => {
  try {
    const newModule = await Module.create(req.body);
    res.status(201).json(newModule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Lesson
router.post('/admin/lessons', protect, admin, async (req, res) => {
  try {
    const newLesson = await Lesson.create(req.body);
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Quiz
router.post('/admin/quizzes', protect, admin, async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
