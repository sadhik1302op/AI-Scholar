const express = require('express');
const axios = require('axios');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// AI Chatbot Tutor
router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const prompt = `Explain this simply for a middle school student with examples: ${question}`;
    
    // Using HuggingFace's official Router API format with a verified supported model
    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      { 
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let generatedText = "I couldn't generate a response.";
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      generatedText = response.data.choices[0].message.content;
    }

    res.json({ reply: generatedText });
  } catch (error) {
    console.error("HuggingFace API Error:", error.response?.data || error.message);
    
    if (error.response && error.response.status === 503) {
      return res.json({ reply: "AI is warming up, please try again in a few seconds." });
    }
    
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
