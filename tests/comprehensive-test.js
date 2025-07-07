#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

class MCPTester {
  constructor() {
    this.testResults = [];
    this.server = null;
  }

  log(message, type = 'info') {
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      const serverPath = join(__dirname, '..', 'src', 'index.js');
      this.server = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.server.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('MCP Review Server running on stdio')) {
          this.log('Server started successfully', 'success');
          resolve();
        }
      });

      this.server.on('error', (error) => {
        this.log(`Server failed to start: ${error.message}`, 'error');
        reject(error);
      });

      // Timeout if server doesn't start
      setTimeout(() => {
        if (!this.server.killed) {
          reject(new Error('Server start timeout'));
        }
      }, 5000);
    });
  }

  async sendRequest(request) {
    return new Promise((resolve, reject) => {
      let responseReceived = false;
      
      const timeout = setTimeout(() => {
        if (!responseReceived) {
          reject(new Error('Request timeout'));
        }
      }, 5000);

      this.server.stdout.once('data', (data) => {
        responseReceived = true;
        clearTimeout(timeout);
        try {
          const response = JSON.parse(data.toString().trim());
          resolve(response);
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data.toString()}`));
        }
      });

      this.server.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async testListTools() {
    this.log('Testing tools/list...');
    
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
      params: {}
    };

    try {
      const response = await this.sendRequest(request);
      
      // Validate response structure
      if (!response.result || !response.result.tools || !Array.isArray(response.result.tools)) {
        throw new Error('Invalid tools list response structure');
      }

      const tools = response.result.tools;
      if (tools.length < 30) { // Should have around 36 critic tools
        throw new Error(`Expected many critic tools, got ${tools.length}`);
      }

      // Check that all tools are critic tools
      const nonCriticTools = tools.filter(tool => !tool.name.startsWith('critique_'));
      if (nonCriticTools.length > 0) {
        throw new Error(`Found non-critic tools: ${nonCriticTools.map(t => t.name).join(', ')}`);
      }

      this.log(`✓ Tools list test passed (Found ${tools.length} critic tools)`, 'success');
      return true;
    } catch (error) {
      this.log(`✗ Tools list test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testCriticTool(testCase) {
    this.log(`Testing critic tool: ${testCase.name}...`);
    
    const request = {
      jsonrpc: "2.0",
      id: testCase.id,
      method: "tools/call",
      params: {
        name: testCase.toolName,
        arguments: testCase.args
      }
    };

    try {
      const response = await this.sendRequest(request);
      
      if (!response.result || !response.result.content || !Array.isArray(response.result.content)) {
        throw new Error('Invalid tool call response structure');
      }

      const content = response.result.content[0];
      if (content.type !== 'text') {
        throw new Error('Expected text content type');
      }

      // Validate that we got a critique prompt with embedded framework
      const text = content.text;
      if (!text.includes('Please review the following code using the') || !text.includes('critic framework')) {
        throw new Error('Response does not contain expected critique structure');
      }

      // Check that the critic framework content is embedded
      const expectedCritic = testCase.toolName.replace('critique_', '');
      if (!text.includes(`## ${expectedCritic} Critic Framework:`)) {
        throw new Error(`Response does not include embedded ${expectedCritic} critic framework`);
      }

      // Check that the code is included
      if (!text.includes(testCase.args.code)) {
        throw new Error('Response does not include the submitted code');
      }

      this.log(`✓ ${testCase.name} test passed`, 'success');
      return true;
    } catch (error) {
      this.log(`✗ ${testCase.name} test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testInvalidTool() {
    this.log('Testing invalid tool call...');
    
    const request = {
      jsonrpc: "2.0",
      id: 999,
      method: "tools/call",
      params: {
        name: "nonexistent_tool",
        arguments: {}
      }
    };

    try {
      const response = await this.sendRequest(request);
      
      if (!response.error) {
        throw new Error('Expected error response for invalid tool');
      }

      this.log('✓ Invalid tool test passed', 'success');
      return true;
    } catch (error) {
      this.log(`✗ Invalid tool test failed: ${error.message}`, 'error');
      return false;
    }
  }

  cleanup() {
    if (this.server && !this.server.killed) {
      this.server.kill();
    }
  }

  async runAllTests() {
    this.log('Starting comprehensive MCP server tests...');
    
    try {
      await this.startServer();
      
      const testCases = [
        {
          id: 2,
          name: 'Design critic with UI code',
          toolName: 'critique_design',
          args: { 
            code: 'function createButton() { return "<button onclick=\\"alert(\'clicked\')\\">Click</button>"; }', 
            language: 'javascript',
            filePath: 'button.js'
          }
        },
        {
          id: 3,
          name: 'C memory critic with C code',
          toolName: 'critique_c-memory',
          args: { 
            code: 'char* createString() { char* str = malloc(100); strcpy(str, "hello"); return str; }', 
            language: 'c',
            filePath: 'memory.c'
          }
        },
        {
          id: 4,
          name: 'Algorithm performance critic',
          toolName: 'critique_algorithm-performance',
          args: { 
            code: 'function bubbleSort(arr) { for(let i=0; i<arr.length; i++) { for(let j=0; j<arr.length-1; j++) { if(arr[j] > arr[j+1]) { let temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp; } } } return arr; }', 
            language: 'javascript',
            filePath: 'sort.js'
          }
        },
        {
          id: 5,
          name: 'SQL security critic',
          toolName: 'critique_sql-security',
          args: { 
            code: 'SELECT * FROM users WHERE username = "' + 'userInput' + '" AND password = "' + 'password' + '"', 
            language: 'sql',
            filePath: 'auth.sql'
          }
        },
        {
          id: 6,
          name: 'Error handling critic',
          toolName: 'critique_general-error-handling',
          args: { 
            code: 'function divide(a, b) { return a / b; }', 
            language: 'javascript',
            filePath: 'math.js'
          }
        }
      ];

      let passedTests = 0;
      const totalTests = testCases.length + 2; // +2 for list tools and invalid tool tests

      // Test 1: List tools
      if (await this.testListTools()) passedTests++;

      // Test 2-6: Code review tests
      for (const testCase of testCases) {
        if (await this.testCriticTool(testCase)) passedTests++;
      }

      // Test 7: Invalid tool
      if (await this.testInvalidTool()) passedTests++;

      this.log(`\n=== TEST SUMMARY ===`);
      this.log(`Total tests: ${totalTests}`);
      this.log(`Passed: ${passedTests}`, passedTests === totalTests ? 'success' : 'error');
      this.log(`Failed: ${totalTests - passedTests}`, totalTests - passedTests === 0 ? 'success' : 'error');
      
      if (passedTests === totalTests) {
        this.log('\n🎉 ALL TESTS PASSED! MCP server is working perfectly!', 'success');
      } else {
        this.log('\n⚠️  Some tests failed. Please check the output above.', 'error');
      }

    } catch (error) {
      this.log(`Fatal error: ${error.message}`, 'error');
    } finally {
      this.cleanup();
    }
  }
}

// Run tests
const tester = new MCPTester();
tester.runAllTests().catch(console.error);
