#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Test the MCP server
async function testMCPServer() {
  console.log('Testing MCP Server...');
  
  const serverPath = join(__dirname, 'src', 'index.js');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test 1: List tools
  const listToolsRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };

  console.log('Sending list tools request...');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  // Listen for response
  server.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString().trim());
      console.log('✅ Server response:', JSON.stringify(response, null, 2));
      
      // Test 2: Call the code_review tool
      if (response.result && response.result.tools) {
        const callToolRequest = {
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "code_review",
            arguments: {
              code: "function test() { console.log('hello'); }",
              language: "javascript"
            }
          }
        };
        
        console.log('\nSending code review request...');
        server.stdin.write(JSON.stringify(callToolRequest) + '\n');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.log('Raw response:', data.toString());
    }
  });

  server.stderr.on('data', (data) => {
    console.log('Server stderr:', data.toString());
  });

  server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
  });

  // Clean up after 10 seconds
  setTimeout(() => {
    server.kill();
    console.log('\n✅ Test completed');
    process.exit(0);
  }, 10000);
}

testMCPServer().catch(console.error);
