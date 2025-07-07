# MCP Review Server

A minimal Model Context Protocol (MCP) server that provides code review capabilities.

## Features

- **Code Review Tool**: Analyzes code and provides feedback on potential issues and improvements

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the server:
   ```bash
   npm start
   ```

## Development

- `npm start` - Run the server
- `npm run dev` - Run in development mode

## Tool Available

### `code_review`
Analyzes provided code and returns:
- Summary of the review
- List of potential issues
- Suggestions for improvement
- Quality score (1-10)

**Parameters:**
- `code` (required): The code to review
- `language` (optional): Programming language (default: "typescript")

## Usage with VS Code Copilot

Add this server to your MCP configuration to use it with VS Code Copilot for automated code reviews.
