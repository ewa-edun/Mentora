const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

// Generate summary from text
async function generateSummary(text) {
  const prompt = `Summarize the following for a student:\n${text}`;
  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}

// Generate quiz questions from text
async function generateQuiz(text) {
  const prompt = `Create 3 quiz questions (with answers) from this material:\n${text}`;
  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}

// General Q&A
async function askGemini(question) {
  const response = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: question }] }]
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}

module.exports = { generateSummary, generateQuiz, askGemini };