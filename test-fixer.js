#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Testing fixer tool...');

const server = spawn('node', [join(__dirname, 'src', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

server.stderr.on('data', (data) => {
  console.log('Server started:', data.toString().trim());
});

server.stdout.on('data', (data) => {
  const response = data.toString().trim();
  console.log('Response received, length:', response.length);
  
  try {
    const parsed = JSON.parse(response);
    if (parsed.result && parsed.result.content && parsed.result.content[0]) {
      const text = parsed.result.content[0].text;
      console.log('✅ Success! Fixer response contains:');
      console.log('- Strategy section:', text.includes('Fixer Strategy:') ? 'YES' : 'NO');
      console.log('- Original code section:', text.includes('Original Code:') ? 'YES' : 'NO');
      console.log('- Critic results section:', text.includes('Critic Analysis Results:') ? 'YES' : 'NO');
      console.log('- Instructions section:', text.includes('Instructions:') ? 'YES' : 'NO');
    }
  } catch (error) {
    console.error('Parse error:', error.message);
  }
  
  server.kill();
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

setTimeout(() => {
  console.log('Sending fixer test request...');
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "fix_conservative",
      arguments: {
        code: "function unsafeFunction() { eval(userInput); return result; }",
        critiqueResults: "Issues found: 1. Use of eval() is dangerous. 2. Missing error handling. 3. Undefined variables.",
        language: "javascript",
        filePath: "unsafe.js"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

setTimeout(() => {
  console.log('Test timeout');
  server.kill();
}, 5000);
