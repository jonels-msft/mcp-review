#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function testServer() {
  console.log('Starting simple MCP server test...');
  
  const serverPath = join(__dirname, 'src', 'index.js');
  console.log('Server path:', serverPath);
  
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  server.on('error', (error) => {
    console.error('❌ Server error:', error);
  });

  server.on('exit', (code) => {
    console.log('Server exited with code:', code);
  });

  // Wait for server to start
  console.log('Waiting for server to start...');
  await new Promise((resolve) => {
    server.stderr.on('data', (data) => {
      console.log('Server stderr:', data.toString());
      if (data.toString().includes('MCP Review Server running on stdio')) {
        console.log('✅ Server started successfully');
        resolve();
      }
    });
    
    setTimeout(() => {
      console.log('❌ Server start timeout');
      resolve();
    }, 3000);
  });

  // Test tools/list
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };

  console.log('Sending tools/list request...');
  server.stdin.write(JSON.stringify(request) + '\n');

  // Wait for response
  server.stdout.once('data', (data) => {
    try {
      const response = JSON.parse(data.toString().trim());
      console.log('✅ Received response:', JSON.stringify(response, null, 2));
      
      if (response.result && response.result.tools) {
        console.log(`✅ Found ${response.result.tools.length} tools`);
        console.log('First few tools:', response.result.tools.slice(0, 3).map(t => t.name));
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Raw response:', data.toString());
    }
    
    server.kill();
  });

  setTimeout(() => {
    console.log('❌ Test timeout');
    server.kill();
  }, 5000);
}

testServer().catch(console.error);
