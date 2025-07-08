#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CRITICS_DIR = join(__dirname, '..', 'ai-review', 'critic');
const FIXERS_DIR = join(__dirname, '..', 'ai-review', 'fixer');

// Load available critics from the critic directory
function loadCritics() {
  try {
    const criticFiles = readdirSync(CRITICS_DIR).filter(file => file.endsWith('.md'));
    const critics = {};
    
    for (const file of criticFiles) {
      const criticName = basename(file, '.md');
      const criticPath = join(CRITICS_DIR, file);
      const criticContent = readFileSync(criticPath, 'utf-8');
      
      critics[criticName] = {
        name: criticName,
        description: `Code review using the ${criticName} critic framework`,
        content: criticContent
      };
    }
    
    return critics;
  } catch (error) {
    console.error('Error loading critics:', error);
    return {};
  }
}

// Load available fixers from the fixer directory
function loadFixers() {
  try {
    const fixerFiles = readdirSync(FIXERS_DIR).filter(file => file.endsWith('.md'));
    const fixers = {};
    
    for (const file of fixerFiles) {
      const fixerName = basename(file, '.md');
      const fixerPath = join(FIXERS_DIR, file);
      const fixerContent = readFileSync(fixerPath, 'utf-8');
      
      fixers[fixerName] = {
        name: fixerName,
        description: `Apply ${fixerName} fixing strategy to address critic issues`,
        content: fixerContent
      };
    }
    
    return fixers;
  } catch (error) {
    console.error('Error loading fixers:', error);
    return {};
  }
}

const critics = loadCritics();
const fixers = loadFixers();

// Create MCP server
const server = new Server(
  {
    name: 'mcp-review-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Create user-friendly tool names dynamically
function createDynamicTools() {
  const criticTools = Object.keys(critics).map(criticName => ({
    name: `review-${criticName}`,
    description: `Review code using the ${criticName} framework from critic/${criticName}.md`,
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The code or project content to review',
        },
        language: {
          type: 'string', 
          description: 'Programming language or context of the code',
          default: 'unknown',
        },
        filePath: {
          type: 'string',
          description: 'Optional: Path to the file being reviewed',
        }
      },
      required: ['code'],
    }
  }));

  const fixerTools = Object.keys(fixers).map(fixerName => ({
    name: `fix-${fixerName}`,
    description: `Apply ${fixerName} fixing strategy from fixer/${fixerName}.md`,
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The original code that was reviewed',
        },
        critiqueResults: {
          type: 'string',
          description: 'The results from the critic analysis',
        },
        language: {
          type: 'string',
          description: 'Programming language or context of the code', 
          default: 'unknown',
        },
        filePath: {
          type: 'string',
          description: 'Optional: Path to the file being fixed',
        }
      },
      required: ['code', 'critiqueResults'],
    }
  }));

  return { criticTools, fixerTools };
}

const { criticTools, fixerTools } = createDynamicTools();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [...criticTools, ...fixerTools] };
});

// Handle tool calls with dynamic parsing
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Parse review-name syntax
  if (name.startsWith('review-')) {
    const criticName = name.replace('review-', '');
    const critic = critics[criticName];
    
    if (!critic) {
      throw new Error(`Unknown critic: ${criticName}. Available critics: ${Object.keys(critics).join(', ')}`);
    }

    const { code, language = 'unknown', filePath = 'unknown' } = args;
    const critique = performCritique(critic, code, language, filePath);
    
    return {
      content: [
        {
          type: 'text',
          text: critique,
        },
      ],
    };
  }

  // Parse fix-name syntax
  if (name.startsWith('fix-')) {
    const fixerName = name.replace('fix-', '');
    const fixer = fixers[fixerName];
    
    if (!fixer) {
      throw new Error(`Unknown fixer: ${fixerName}. Available fixers: ${Object.keys(fixers).join(', ')}`);
    }

    const { code, critiqueResults, language = 'unknown', filePath = 'unknown' } = args;
    const fixedCode = performFix(fixer, code, critiqueResults, language, filePath);
    
    return {
      content: [
        {
          type: 'text',
          text: fixedCode,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}. Use review-<name> or fix-<name> syntax.`);
});

// Perform critique using the specified critic framework
function performCritique(critic, code, language, filePath) {
  // Include the critic framework content directly since the agent 
  // won't have access to files outside the user's project workspace
  const prompt = `## ${critic.name} Critic Framework:
${critic.content}

## Code to Review:
**File:** ${filePath}
**Language:** ${language}

\`\`\`${language}
${code}
\`\`\``;

  return prompt;
}

// Perform fix using the specified fixer strategy
function performFix(fixer, code, critiqueResults, language, filePath) {
  // Include the fixer strategy content directly
  const prompt = `## ${fixer.name} Fixer Strategy:
${fixer.content}

## Original Code:
**File:** ${filePath}
**Language:** ${language}

\`\`\`${language}
${code}
\`\`\`

## Critic Analysis Results:
${critiqueResults}`;

  return prompt;
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Review Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
