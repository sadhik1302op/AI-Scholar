const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
async function test() {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyBblri5j7dRTDbDTfwmPaDfgzrKxA7jNaI");
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" }); 
    const result = await model.generateContent("hello");
    fs.writeFileSync('error_utf8.txt', result.response.text());
  } catch (e) {
    fs.writeFileSync('error_utf8.txt', String(e));
  }
}
test();
