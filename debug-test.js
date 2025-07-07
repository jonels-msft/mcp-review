#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function simpleTest() {
  console.log('Starting debug test...');
  
  const server = spawn('node', [join(__dirname, 'src', 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let resolved = false;

  server.stderr.on('data', (data) => {
    console.log('STDERR:', data.toString());
  });

  server.stdout.on('data', (data) => {
    console.log('STDOUT:', data.toString());
    if (!resolved) {
      resolved = true;
      server.kill();
    }
  });

  server.on('close', (code) => {
    console.log('Server closed with code:', code);
  });

  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Sending request...');
  server.stdin.write('{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fix_comment","arguments":{"code":"test","critiqueResults":"test"}}}\n');

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!resolved) {
    console.log('No response received, killing server...');
    server.kill();
  }
}

simpleTest().catch(console.error);
