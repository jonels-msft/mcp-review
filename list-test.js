#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Testing tools/list...');

const server = spawn('node', [join(__dirname, 'src', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

server.stderr.on('data', (data) => {
  console.log('Server started:', data.toString().trim());
});

server.stdout.on('data', (data) => {
  console.log('Server response:');
  try {
    const response = JSON.parse(data.toString().trim());
    if (response.result && response.result.tools) {
      console.log(`Found ${response.result.tools.length} tools`);
      console.log('First 5 tools:');
      response.result.tools.slice(0, 5).forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description}`);
      });
    }
  } catch (error) {
    console.error('Parse error:', error.message);
    console.log('Raw response:', data.toString());
  }
  server.kill();
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

setTimeout(() => {
  console.log('Sending tools/list request...');
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
}, 1000);

setTimeout(() => {
  console.log('Test timeout, killing server');
  server.kill();
}, 5000);
