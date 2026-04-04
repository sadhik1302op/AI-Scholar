require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
async function test() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "hello" }]
    });
    fs.writeFileSync('error_utf8.txt', response.choices[0].message.content);
  } catch (e) {
    fs.writeFileSync('error_utf8.txt', String(e));
  }
}
test();
