const https = require('https');

function requestData(url, options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP Error ${res.statusCode}: ${data}`));
            return;
          }
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeCodeLocally(language, code) {
  // Use Paiza.io API - Completely free, no API keys or credit cards required!
  const languageMap = {
    javascript: 'javascript',
    python: 'python3',
    cpp: 'cpp',
    java: 'java'
  };

  const paizaLang = languageMap[language];
  if (!paizaLang) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const postData = JSON.stringify({
    source_code: code,
    language: paizaLang,
    api_key: "guest"
  });

  // Step 1: Create Runner
  const createData = await requestData('https://api.paiza.io/runners/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, postData);

  if (!createData.id) {
    throw new Error("Failed to create execution runner on Paiza.io");
  }

  // Step 2: Poll for completion
  let attempts = 0;
  while (attempts < 15) {
    await delay(1000); // Wait 1 second before polling
    const details = await requestData(`https://api.paiza.io/runners/get_details?id=${createData.id}&api_key=guest`, { method: 'GET' });
    
    if (details.status === 'completed') {
      // Compilation Errors
      let compileError;
      if (details.build_result === 'failure' || details.build_result === 'error') {
        compileError = { output: details.build_stderr || details.build_stdout || 'Compilation failed', code: 1 };
      }

      // Execution Errors
      let runErrorStr = details.stderr || '';
      if (details.result !== 'success' && !runErrorStr) {
        runErrorStr = `Execution finished with status: ${details.result}`;
      }

      return {
        compile: compileError,
        run: compileError ? undefined : { 
          output: details.stdout || '', 
          stderr: runErrorStr, 
          code: details.result === 'success' ? 0 : 1 
        },
        message: details.result !== 'success' ? `Execution status: ${details.result}` : undefined
      };
    }
    
    attempts++;
  }

  throw new Error("Execution timed out after 15 seconds.");
}

module.exports = { executeCodeLocally };
