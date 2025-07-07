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

const critics = loadCritics();

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

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = Object.values(critics).map(critic => ({
    name: `critique_${critic.name}`,
    description: critic.description,
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
    },
  }));

  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Check if this is a critic tool
  if (name.startsWith('critique_')) {
    const criticName = name.replace('critique_', '');
    const critic = critics[criticName];
    
    if (!critic) {
      throw new Error(`Unknown critic: ${criticName}`);
    }

    const { code, language = 'unknown', filePath = 'unknown' } = args;
    
    // Create a comprehensive critique using the critic framework
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

  throw new Error(`Unknown tool: ${name}`);
});

// Perform critique using the specified critic framework
function performCritique(critic, code, language, filePath) {
  // Include the critic framework content directly since the agent 
  // won't have access to files outside the user's project workspace
  const prompt = `Please review the following code using the ${critic.name} critic framework.

## ${critic.name} Critic Framework:
${critic.content}

## Code to Review:
**File:** ${filePath}
**Language:** ${language}

\`\`\`${language}
${code}
\`\`\`

Apply the critic framework above to provide a thorough code review.`;

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
