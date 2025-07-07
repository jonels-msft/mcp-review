#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function testCriticTool() {
  console.log('🔍 Testing a specific critic tool...\n');
  
  const serverPath = join(__dirname, 'src', 'index.js');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Wait for server to start
  await new Promise((resolve) => {
    server.stderr.on('data', (data) => {
      if (data.toString().includes('MCP Review Server running on stdio')) {
        resolve();
      }
    });
  });

  // Test a specific critic tool
  const testCode = `
function processUserData(userData) {
    console.log("Processing:", userData);
    
    // Direct manipulation without validation
    userData.name = userData.name.toUpperCase();
    userData.age = parseInt(userData.age);
    
    return userData;
}
`;

  const criticRequest = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "critique_design",
      arguments: {
        code: testCode,
        language: "javascript",
        filePath: "user-processor.js"
      }
    }
  };

  server.stdin.write(JSON.stringify(criticRequest) + '\n');

  server.stdout.once('data', (data) => {
    try {
      const response = JSON.parse(data.toString().trim());
      
      if (response.result && response.result.content) {
        const content = response.result.content[0];
        console.log('✅ Critic tool response:');
        console.log('==========================================');
        console.log(content.text);
        console.log('==========================================');
        console.log('\n🎉 Critic tool working correctly!');
      } else {
        console.log('❌ Invalid response structure:', response);
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response:', data.toString());
    }
    
    server.kill();
  });
}

testCriticTool().catch(console.error);
