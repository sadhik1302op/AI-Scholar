require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function test(modelName) {
  try {
    const url = 'https://router.huggingface.co/hf-inference/v1/chat/completions';
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
    fs.appendFileSync('out2.json', `[SUCCESS] ${modelName}\n`);
  } catch (err) {
    const msg = err.response ? err.response.status + " " + JSON.stringify(err.response.data) : err.message;
    fs.appendFileSync('out2.json', `[ERROR] ${modelName} ${msg}\n`);
  }
}

async function run() {
  fs.writeFileSync('out2.json', '');
  await test('google/gemma-1.1-7b-it');
  await test('HuggingFaceH4/zephyr-7b-beta');
  await test('Qwen/Qwen2.5-Coder-32B-Instruct');
  await test('google/flan-t5-base');
  await test('google/flan-t5-large');
}
run();
