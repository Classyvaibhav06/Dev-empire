const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function executeCodeLocally(language, code) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dev-empire-'));
  let filename = '';
  let command = '';
  let args = [];

  switch (language) {
    case 'javascript':
      filename = 'main.js';
      command = 'node';
      args = [filename];
      break;
    case 'python':
      filename = 'main.py';
      command = 'python';
      args = [filename];
      break;
    case 'cpp':
      filename = 'main.cpp';
      command = 'g++';
      args = [filename, '-o', 'main.exe'];
      break;
    case 'java':
      filename = 'Main.java';
      command = 'javac';
      args = [filename];
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }

  const filepath = path.join(tmpDir, filename);
  await fs.writeFile(filepath, code);

  const runCommand = (cmd, cmdArgs) => {
    return new Promise((resolve) => {
      const proc = spawn(cmd, cmdArgs, { 
        cwd: tmpDir, 
        timeout: 5000,
        env: { ...process.env, PYTHONIOENCODING: 'utf8' }
      });
      let output = '';
      
      proc.stdout.on('data', (data) => output += data.toString());
      proc.stderr.on('data', (data) => output += data.toString());
      
      proc.on('close', (code) => {
        resolve({ output, code });
      });
      proc.on('error', (err) => {
        resolve({ output: err.message + '\n' + output, code: 1 });
      });
    });
  };

  try {
    let result;
    if (language === 'cpp') {
      const compileResult = await runCommand(command, args);
      if (compileResult.code !== 0) {
        return { run: { output: compileResult.output, code: compileResult.code } };
      }
      result = await runCommand(path.join(tmpDir, 'main.exe'), []);
    } else if (language === 'java') {
      const compileResult = await runCommand(command, args);
      if (compileResult.code !== 0) {
        return { run: { output: compileResult.output, code: compileResult.code } };
      }
      result = await runCommand('java', ['Main']);
    } else {
      result = await runCommand(command, args);
    }
    return { run: result };
  } finally {
    // Clean up
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error('Failed to cleanup tmp dir', e);
    }
  }
}

module.exports = { executeCodeLocally };
