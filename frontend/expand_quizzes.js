import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const BASE_URL = 'https://integrate.api.nvidia.com/v1';

const filePath = path.join(__dirname, 'src', 'utils', 'conceptContentMap.js');
let fileContent = fs.readFileSync(filePath, 'utf-8');

async function expandQuizzes() {
  console.log("Parsing file...");
  
  // Extract all concept blocks
  const conceptRegex = /'([a-z0-9-]+)':\s*\{[\s\S]*?test:\s*\{([\s\S]*?)\}\s*\}/g;
  
  let matches = [...fileContent.matchAll(conceptRegex)];
  console.log(`Found ${matches.length} concepts.`);

  for (let i = 0; i < matches.length; i++) {
    const conceptKey = matches[i][1];
    const fullBlock = matches[i][0];
    const testBlock = matches[i][2];

    console.log(`Processing ${i+1}/${matches.length}: ${conceptKey}`);

    // If it already has tests array instead of test object, skip
    if (fullBlock.includes('tests: [')) continue;

    // Use LLM to generate 4 more questions
    try {
      const prompt = `Generate exactly 4 multiple-choice questions for a web development concept: "${conceptKey}". 
Return ONLY a valid JSON array of 4 objects. Do not wrap in markdown or backticks. 
Format of each object:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "answer": integer (0 to 3),
  "explanation": "string"
}`;
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      let responseText = data.choices[0].message.content.trim();
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      }
      if (responseText.startsWith('```')) {
        responseText = responseText.replace(/```/g, '').trim();
      }

      const generatedQuestions = JSON.parse(responseText);

      if (generatedQuestions.length === 4) {
        // Format the original test block
        const originalTestStr = `{\n${testBlock}\n      }`;
        
        // Format the new questions to match the JS code style
        const newTestsStr = generatedQuestions.map(q => `      {
        question: ${JSON.stringify(q.question)},
        options: ${JSON.stringify(q.options)},
        answer: ${q.answer},
        explanation: ${JSON.stringify(q.explanation)}
      }`).join(',\n');

        const replacement = fullBlock.replace(
          /test:\s*\{[\s\S]*?\}\s*(?=\})/,
          `tests: [\n      ${originalTestStr},\n${newTestsStr}\n    ]\n  `
        );

        fileContent = fileContent.replace(fullBlock, replacement);
      } else {
        console.error(`Invalid number of questions generated for ${conceptKey}`);
      }
    } catch (e) {
      console.error(`Error processing ${conceptKey}:`, e.message);
    }
  }

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log("Finished expanding quizzes.");
}

expandQuizzes();
