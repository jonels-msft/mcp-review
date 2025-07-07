#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runTest(testName, testFile) {
  console.log(`\n🔄 Running ${testName}...`);
  console.log('='.repeat(50));
  
  return new Promise((resolve) => {
    const testProcess = spawn('node', [join(__dirname, testFile)], {
      stdio: 'inherit'
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${testName} completed successfully`);
        resolve(true);
      } else {
        console.log(`❌ ${testName} failed with code ${code}`);
        resolve(false);
      }
    });
    
    testProcess.on('error', (error) => {
      console.log(`❌ ${testName} error: ${error.message}`);
      resolve(false);
    });
  });
}

async function runAllTests() {
  console.log('🧪 MCP Review Server Test Suite');
  console.log('='.repeat(50));
  
  const tests = [
    ['MCP Protocol Validation', 'validate-mcp.js'],
    ['Comprehensive Feature Tests', 'comprehensive-test.js']
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const [name, file] of tests) {
    const result = await runTest(name, file);
    if (result) passed++;
  }
  
  console.log('\n📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! MCP server is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the output above.');
    process.exit(1);
  }
}

runAllTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
