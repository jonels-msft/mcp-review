# Specialized Code Review Tools for Copilot

A Model Context Protocol (MCP) server that provides specialized code review capabilities using established critic methodologies and fixing strategies.

## Example Usage

The workflow has two steps in your VS Code agent chat:

1. **Analysis**: Use a critic tool to analyze code and identify issues
2. **Fix**: Apply a fixer strategy to address the identified problems

### Step 1: Analyze Code

Start a new chat to clear context, then write a request like:

```
review-design this React component
review-c-memory myfunc()
review-sql-security app_schema.sql
```

### Step 2: Apply Fixes

Choose one:

```
fix-conservative
fix-comment
fix-zealot
```

## Features

- **36+ Specialized Critics**: Each critic focuses on specific aspects of code quality
- **3 Fixing Strategies**: Methods for addressing critic findings
- **Explicit Invocation**: Users explicitly choose which critic or fixer to apply to their code
- **Established Methodologies**: Uses frameworks from the ai-review repository
- **Two-Step Workflow**: Analysis first, then apply fixing strategy

## Setup

### Prerequisites
- Node.js 18.0 or higher
- VS Code with GitHub Copilot extension

### Installation

1. Clone with submodules to get critic frameworks:
   ```bash
   git clone --recursive https://github.com/jonels-msft/mcp-review.git
   cd mcp-review

   # OR if already cloned:
   # git submodule update --init --recursive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### VS Code Configuration

Add the MCP server to your VS Code settings. Open your VS Code settings (JSON) and add the following to the `mcp.servers` section:

#### For Windows/macOS/Linux (Native)

```json
{
    "mcp": {
        "servers": {
            "mcp-review": {
                "command": "node",
                "args": [
                    "/path/to/your/mcp-review/src/index.js"
                ]
            }
        }
    }
}
```

#### For WSL (Windows Subsystem for Linux)

When using WSL, VS Code executes the server inside the Linux environment:

```json
{
    "mcp": {
        "servers": {
            "mcp-review": {
                "command": "wsl",
                "args": [
                    "node",
                    "/path/to/your/mcp-review/src/index.js"
                ]
            }
        }
    }
}
```

If Node.js is not in your WSL PATH (e.g., when using NVM), specify the full path:

```json
{
    "mcp": {
        "servers": {
            "mcp-review": {
                "command": "wsl",
                "args": [
                    "/home/username/.nvm/versions/node/v18.20.8/bin/node",
                    "/path/to/your/mcp-review/src/index.js"
                ]
            }
        }
    }
}
```

**Important**: Replace `/path/to/your/mcp-review/` with the actual path where you cloned this repository (use Unix-style paths for WSL).

After adding the configuration, restart VS Code. VS Code will invoke the server automatically when you use the review tools in Copilot chat.

## Available MCP Tools
The server loads all critic methodologies from the `ai-review/critic` directory and fixer strategies from the `ai-review/fixer` directory.

### Critic MCP Tools
All critics follow the naming pattern `review-<critic-name>` and are organized by category:

### Design & UI Critics
- `review-design` - UI and user experience review
- `review-color` - Color usage and accessibility
- `review-data-visualization` - Charts and data presentation

### Security Critics
- `review-sql-security` - SQL injection and database security
- `review-sql-data-integrity` - Data validation and constraints

### Performance Critics
- `review-algorithm-performance` - Algorithm efficiency analysis
- `review-algorithm-correctness` - Algorithm correctness verification
- `review-logging-performance` - Logging overhead analysis

### Memory & Resource Management
- `review-c-memory` - C memory management review
- `review-c-error-handling` - C error handling patterns
- `review-c-portability` - Cross-platform C code

### Error Handling
- `review-general-error-handling` - Error handling best practices
- `review-procedural-error` - Procedural error management

### Data & Logic
- `review-procedural-data` - Data structure and flow analysis
- `review-procedural-functions` - Function design and organization
- `review-procedural-flow` - Control flow analysis
- `review-floating-point` - Numerical precision and floating-point issues
- `review-datetime` - Date/time handling correctness
- `review-unicode` - Unicode and internationalization

### Standards & Compliance
- `review-sql-standard-compliance` - SQL standard adherence
- `review-posix` - POSIX compliance and portability
- `review-unix-interface` - Unix philosophy and interfaces

### Development Practices
- `review-logging-practices` - Logging strategy and implementation
- `review-terminology` - Naming conventions and clarity
- `review-writing` - Documentation and comments
- `review-estimation` - Complexity and effort estimation
- `review-benchmarking` - Performance measurement practices

### Specialized Critics
- `review-meson` - Meson build system review
- `review-probability` - Statistical and probabilistic code
- `review-relational` - Database design and relationships
- `review-prompting` - AI prompt engineering
- `review-logicism` - Formal logic and reasoning
- `review-taylorism` - Workflow and efficiency analysis

### Fixer MCP Tools
Three fixer strategies are available:

- `fix-comment` - Add TODO comments marking issues for later fixing
- `fix-conservative` - Fix only clear-cut, low-risk issues that won't require cascading changes
- `fix-zealot` - Pick one important issue and fix it comprehensively, even if it requires major reorganization

## Development

### Testing
- `npm test` - Run all test suites
- `npm run test:mcp` - Run MCP protocol validation
- `npm run test:comprehensive` - Run comprehensive feature tests

### Utilities
- `npm run status` - Display server capabilities and status
- `npm run check` - Check VS Code integration readiness

### Manual Testing
To debug, you can run the server manually:
- `npm start` - Run the server in standalone mode
- `npm run dev` - Run in development mode with auto-restart

### Project Structure
```
mcp-review/
├── src/           # Server implementation
├── tests/         # Test suites
├── scripts/       # Utility scripts
├── ai-review/     # Critic and fixer frameworks (submodule)
└── README.md      # Project documentation
```

## Credit

Critic frameworks provided by the [ai-review](https://dev.begriffs.com/ai-review) repository by Joe Nelson.
