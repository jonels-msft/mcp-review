#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🔍 MCP Server Validation for VS Code Integration');
console.log('='.repeat(50));

async function validateMCPCompliance() {
  const server = spawn('node', [join(__dirname, '..', 'src', 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let testsPassed = 0;
  let totalTests = 0;

  function runTest(name, testFn) {
    totalTests++;
    try {
      const result = testFn();
      if (result) {
        console.log(`✅ ${name}`);
        testsPassed++;
      } else {
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  // Wait for server to start
  await new Promise((resolve) => {
    server.stderr.on('data', (data) => {
      if (data.toString().includes('MCP Review Server running on stdio')) {
        resolve();
      }
    });
  });

  console.log('\n📋 Protocol Compliance Tests:');

  // Test 1: tools/list response format
  const toolsListResponse = await sendRequest(server, {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  });

  runTest('tools/list returns valid JSON-RPC response', () => {
    return toolsListResponse && 
           toolsListResponse.jsonrpc === "2.0" && 
           toolsListResponse.id === 1 &&
           toolsListResponse.result;
  });

  runTest('tools/list includes tools array', () => {
    return toolsListResponse?.result?.tools && 
           Array.isArray(toolsListResponse.result.tools);
  });

  runTest('All tools have required fields', () => {
    const tools = toolsListResponse?.result?.tools || [];
    return tools.length > 0 && tools.every(tool => 
      tool.name && 
      tool.description && 
      tool.inputSchema &&
      tool.inputSchema.type === 'object' &&
      tool.inputSchema.properties &&
      tool.inputSchema.required
    );
  });

  runTest('Expected number of tools (39)', () => {
    return toolsListResponse?.result?.tools?.length === 39;
  });

  // Test 2: tools/call response format
  const toolCallResponse = await sendRequest(server, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "critique_design",
      arguments: {
        code: "function test() { return 'hello'; }",
        language: "javascript"
      }
    }
  });

  runTest('tools/call returns valid response', () => {
    return toolCallResponse && 
           toolCallResponse.jsonrpc === "2.0" && 
           toolCallResponse.id === 2 &&
           toolCallResponse.result;
  });

  runTest('tools/call result has content array', () => {
    return toolCallResponse?.result?.content && 
           Array.isArray(toolCallResponse.result.content);
  });

  runTest('Content has text type', () => {
    const content = toolCallResponse?.result?.content?.[0];
    return content && content.type === 'text' && typeof content.text === 'string';
  });

  // Test 3: Fixer tool functionality
  const fixerResponse = await sendRequest(server, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "fix_conservative",
      arguments: {
        code: "var x = 5;",
        critiqueResults: "Use const instead of var",
        language: "javascript"
      }
    }
  });

  runTest('Fixer tools work correctly', () => {
    return fixerResponse && 
           fixerResponse.result &&
           fixerResponse.result.content &&
           fixerResponse.result.content[0]?.text?.includes('conservative');
  });

  // Test 4: Error handling
  const errorResponse = await sendRequest(server, {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "nonexistent_tool",
      arguments: {}
    }
  });

  runTest('Proper error handling for invalid tools', () => {
    return errorResponse && errorResponse.error;
  });

  console.log('\n📊 Results:');
  console.log(`Passed: ${testsPassed}/${totalTests} tests`);
  
  if (testsPassed === totalTests) {
    console.log('\n🎉 MCP Server is fully compliant for VS Code integration!');
    console.log('\n✅ Protocol Compliance: PASS');
    console.log('✅ Tool Registration: PASS');
    console.log('✅ Response Format: PASS');
    console.log('✅ Error Handling: PASS');
  } else {
    console.log('\n⚠️  Some compliance issues found - review failures above');
  }

  server.kill();
}

async function sendRequest(server, request) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 3000);
    
    server.stdout.once('data', (data) => {
      clearTimeout(timeout);
      try {
        resolve(JSON.parse(data.toString().trim()));
      } catch {
        resolve(null);
      }
    });
    
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

validateMCPCompliance().catch(console.error);
