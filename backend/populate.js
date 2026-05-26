const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const concepts = [
  "Variables & Indentation-based block scope",
  "Lists, Dictionaries, Tuples, and Sets",
  "Functions and Lambdas",
  "Object-Oriented Programming (Classes & Inheritance)",
  "File operations & Exception handling",
  "NumPy Arrays and Vectorized operations",
  "Pandas Series and DataFrames",
  "Data Cleaning: Missing values, Dropping columns",
  "Data Selection, Filtering & Grouping",
  "Reading CSV/JSON files and merging datasets",
  "The Perceptron & Linear Models",
  "Activation Functions (ReLU, Sigmoid, Softmax)",
  "Feedforward & Backpropagation propagation",
  "Loss Functions and Gradient Descent optimization",
  "Layers: Input, Hidden, and Output layers",
  "Transformer Architectures & Self-Attention mechanism",
  "Tokenization and Embedding spaces",
  "Pre-training vs Fine-tuning (RLHF)",
  "Prompt Engineering techniques (CoT, few-shot)",
  "Agent Frameworks (LangChain, MCP)"
];

function generateKey(concept) {
  return concept.toLowerCase().replace(/ /g, '-');
}

async function run() {
  console.log("Generating questions for 20 concepts...");
  
  const prompt = `You are an expert programming instructor. For the following 20 concepts, generate a JSON object. The keys must be the slugified version of the concept name. 
Each value should be an object with the following properties:
- "anatomy": Array of objects { label, detail } (max 3)
- "rules": Array of strings (max 3)
- "tests": Array of exactly 2 multiple-choice questions. Each question is an object with { question, options (array of 4 strings), answer (0-3 index), explanation }

Concepts:
${concepts.map(c => `- ${c} (slug: ${generateKey(c)})`).join('\n')}

IMPORTANT: Output ONLY raw valid JSON. Do not use markdown blocks like \`\`\`json. Return only the JSON object \`{ "variables-&-indentation-based-block-scope": { ... }, ... }\`.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      temperature: 0.2,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    });

    let rawJson = completion.choices[0].message.content.trim();
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    // Validate JSON
    const data = JSON.parse(rawJson);
    
    // Format into string to append
    let outputString = '';
    for (const [key, val] of Object.entries(data)) {
      outputString += `  '${key}': ${JSON.stringify(val, null, 2).replace(/\n/g, '\n  ')},\n`;
    }
    
    fs.writeFileSync('generated_concepts.js', outputString);
    console.log("Successfully generated generated_concepts.js!");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
