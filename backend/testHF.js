require('dotenv').config();
const axios = require('axios');

async function run() {
  const url = 'https://router.huggingface.co/hf-inference/models/google/flan-t5-base';
  try {
    const prompt = "Explain this simply for a middle school student with examples: What is machine learning?";
    const response = await axios.post(
      url,
      { inputs: prompt },
      { headers: { 
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json' 
      } }
    );
    console.log('Success for url:', url);
    console.log(response.data);
  } catch (err) {
    if (err.response) {
      console.log('Error status for url', url, ':', err.response.status);
      console.log('Error data:', err.response.data);
    } else {
      console.log('Error for url', url, ':', err.message);
    }
  }
}
run();
