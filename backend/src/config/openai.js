const { OpenAI } = require('openai');
require('dotenv').config({ override: true });

const apiKey = process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://integrate.api.nvidia.com/v1';

const openai = new OpenAI({
  apiKey,
  baseURL,
});

module.exports = openai;
