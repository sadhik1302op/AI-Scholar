require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log("Testing connection to:", process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("SUCCESS! Connected to Database: " + conn.connection.host);
    process.exit(0);
  } catch (error) {
    console.error("FAILED to connect. Error:", error.message);
    process.exit(1);
  }
}

testConnection();
