require('dotenv').config();

async function test() {
  const url = "https://api-inference.huggingface.co/models/google/flan-t5-base";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: "Explain ML" })
    });
    
    if (!response.ok) {
      console.log("FAIL", response.status, await response.text());
    } else {
      console.log("SUCCESS", await response.json());
    }
  } catch (err) {
    console.error("ERROR", err);
  }
}
test();
