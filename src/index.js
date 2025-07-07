#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

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
  return {
    tools: [
      {
        name: 'code_review',
        description: 'Analyze code and provide review feedback',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to review',
            },
            language: {
              type: 'string',
              description: 'Programming language of the code',
              default: 'typescript',
            },
          },
          required: ['code'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'code_review') {
    const { code, language = 'typescript' } = args;

    // Simple code review logic
    const issues = [];
    const suggestions = [];

    // Basic checks
    if (code.length > 1000) {
      issues.push('Function is quite long, consider breaking it into smaller functions');
    }

    if (code.includes('console.log')) {
      issues.push('Contains console.log statements - consider using a proper logger');
    }

    if (code.includes('any')) {
      issues.push('Uses "any" type - consider using more specific types');
    }

    if (!code.includes('//') && !code.includes('/*')) {
      suggestions.push('Consider adding comments to explain complex logic');
    }

    if (language === 'typescript' && !code.includes('export')) {
      suggestions.push('Consider making functions exportable for better modularity');
    }

    const result = {
      summary: `Reviewed ${code.split('\n').length} lines of ${language} code`,
      issues: issues.length > 0 ? issues : ['No major issues found'],
      suggestions: suggestions.length > 0 ? suggestions : ['Code looks good!'],
      score: Math.max(1, 10 - issues.length * 2),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

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
