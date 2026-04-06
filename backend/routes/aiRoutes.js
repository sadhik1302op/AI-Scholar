const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Chatbot Tutor
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const prompt = `Explain this simply for a middle school student with examples: ${question}`;
    
    // Using Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text();

    if (!generatedText) {
      generatedText = "I couldn't generate a response.";
    }

    res.json({ reply: generatedText });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    
    res.json({ reply: "AI is currently unavailable. Please try again later." });
  }
});

// AI Recommendation Simulation
router.get('/recommendation', protect, (req, res) => {
  const { likes } = req.query; // e.g. "dogs,robots"
  
  const rules = {
    'dogs': ['An article about robot dogs!', 'A cute puppy robot toy'],
    'robots': ['Transformers movie', 'Build-your-own-robot kit'],
    'space': ['Telescope', 'Mars rover documentary']
  };

  let recommendations = ['A general science book for kids!'];
  if (likes) {
    const likeArray = likes.split(',');
    recommendations = [];
    likeArray.forEach(like => {
      if (rules[like.toLowerCase()]) {
        recommendations = [...recommendations, ...rules[like.toLowerCase()]];
      }
    });
  }

  res.json({ recommendations: recommendations.length ? recommendations : ['A general science book for kids!'] });
});

module.exports = router;
