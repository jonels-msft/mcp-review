#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function testCritics() {
  console.log('🔍 Testing MCP Critic Server...\n');
  
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

  // Test tools/list
  const listRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };

  server.stdin.write(JSON.stringify(listRequest) + '\n');

  server.stdout.once('data', (data) => {
    try {
      const response = JSON.parse(data.toString().trim());
      
      if (response.result && response.result.tools) {
        const tools = response.result.tools;
        console.log(`✅ Found ${tools.length} critic tools:\n`);
        
        tools.forEach((tool, index) => {
          const criticName = tool.name.replace('critique_', '');
          console.log(`${index + 1}. ${tool.name}`);
          console.log(`   Description: ${tool.description}`);
          console.log(`   Critic: ${criticName}`);
          console.log('');
        });
        
        console.log('🎉 All critics loaded successfully!');
      } else {
        console.log('❌ Invalid response structure');
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
    }
    
    server.kill();
  });
}

testCritics().catch(console.error);
