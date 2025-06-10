const axios = require('axios');
const fs = require('fs');

const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const WHISPER_API_KEY = import.meta.env.WHISPER_API_KEY;

// Transcribe audio file to text
async function transcribeAudio(filePath) {
  const audio = fs.createReadStream(filePath);
  const formData = new FormData();
  formData.append('file', audio);
  formData.append('model', 'whisper-1');

  const response = await axios.post(WHISPER_API_URL, formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${WHISPER_API_KEY}`,
    },
  });

  return response.data.text;
}

module.exports = { transcribeAudio };