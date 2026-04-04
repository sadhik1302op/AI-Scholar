const axios = require('axios');

async function run() {
  const url = 'https://router.huggingface.co/hf-inference/models/google/flan-t5-large';
  try {
    const prompt = "Explain this simply for a middle school student with examples: What is machine learning?";
    const response = await axios.post(
      url,
      { inputs: prompt },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Success for url:', url);
    console.log(response.data);
  } catch (err) {
    console.log('Error status:', err.response ? err.response.status : err.message);
    if (err.response) console.log('Error data:', err.response.data);
  }
}
run();
