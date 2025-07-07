#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Testing updated critic with embedded content...');

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
      console.log('✅ Success! Response contains:');
      console.log('- Framework section:', text.includes('Critic Framework:') ? 'YES' : 'NO');
      console.log('- Code section:', text.includes('Code to Review:') ? 'YES' : 'NO');
      console.log('- Framework content length:', text.split('Critic Framework:')[1]?.split('## Code to Review:')[0]?.length || 0);
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
  console.log('Sending test request...');
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "critique_design",
      arguments: {
        code: "function test() { return 'hello'; }",
        language: "javascript",
        filePath: "test.js"
      }
    }
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

setTimeout(() => {
  console.log('Test timeout');
  server.kill();
}, 5000);
