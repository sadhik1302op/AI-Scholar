require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

async function test() {
  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const apiStatus = await hf.chatCompletion({
      model: 'HuggingFaceH4/zephyr-7b-beta',
      messages: [
        { role: "system", content: "Explain this simply for a middle school student with examples." },
        { role: "user", content: "What is machine learning?" }
      ]
    });
    console.log("SUCCESS SDK zephyr:", apiStatus.choices[0].message.content);
  } catch (err) {
    console.error("ERROR SDK zephyr:", err.message);
  }
}
test();
