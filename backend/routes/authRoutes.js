const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, passwordHash: password }); // pre-save hook handles hashing

    // Initialize Progress Document
    await UserProgress.create({ userId: user._id, completedLessons: [], quizScores: [], weakAreas: [] });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      progressData: user.progressData,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        xpPoints: user.xpPoints,
        progressData: user.progressData,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const { protect } = require('../middlewares/authMiddleware');

router.put('/sync', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.progressData = req.body.progressData || "{}";
      await user.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
