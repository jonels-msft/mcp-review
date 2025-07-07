# Tests

This directory contains all test files for the MCP Review Server.

## Test Files

- **`run-all.js`** - Main test runner that executes all tests
- **`validate-mcp.js`** - MCP protocol compliance validation
- **`comprehensive-test.js`** - Full functionality tests for all critics and fixers

## Running Tests

```bash
# Run all tests
npm test

# Run individual test suites
npm run test:mcp           # MCP protocol validation only
npm run test:comprehensive # Feature tests only
```

## Test Coverage

- ✅ MCP protocol compliance (JSON-RPC, tool registration, etc.)
- ✅ All 36 critic tools
- ✅ All 3 fixer tools  
- ✅ Error handling
- ✅ Response format validation
- ✅ VS Code integration readiness
