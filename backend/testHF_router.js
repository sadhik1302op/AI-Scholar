require('dotenv').config();
const axios = require('axios');

async function test(modelName) {
  try {
    const url = 'https://router.huggingface.co/v1/chat/completions';
    const response = await axios.post(
      url,
      {
        model: modelName,
        messages: [{ role: "user", content: "Explain ML simply" }]
      },
      { headers: { 
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json' 
      } }
    );
    console.log(`[SUCCESS]`, modelName);
  } catch (err) {
    if (err.response) {
      console.log(`[ERROR]`, modelName, err.response.status, JSON.stringify(err.response.data));
    } else {
      console.log(`[ERROR]`, modelName, err.message);
    }
  }
}

async function run() {
  await test('meta-llama/Llama-3.3-70B-Instruct');
  await test('Qwen/Qwen2.5-Coder-32B-Instruct');
  await test('google/flan-t5-base');
}
run();
