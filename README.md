# MCP Review Server

A comprehensive Model Context Protocol (MCP) server that provides specialized code review capabilities using expert critic frameworks, plus automated fixing strategies to address identified issues.

## Features

- **36+ Specialized Critics**: Each critic focuses on specific aspects of code quality
- **3 Fixing Strategies**: Automated approaches to address critic findings
- **Explicit Invocation**: Users explicitly choose which critic or fixer to apply to their code
- **Expert Frameworks**: Uses proven methodologies from ai-review repository
- **Two-Step Workflow**: Critique first, then apply appropriate fixing strategy

## Setup

1. Clone with submodules to get critic frameworks:
   ```bash
   git clone --recursive <repository-url>
   # OR if already cloned:
   git submodule update --init --recursive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   npm start
   ```

## Available Tools

The server automatically loads all critic frameworks from the `ai-review/critic` directory and fixer strategies from the `ai-review/fixer` directory. 

### Critic Tools
Each critic is available as `review-<critic-name>`:

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
- `review-general-error-handling` - Generic error handling best practices
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

### Fixer Tools
Each fixer strategy is available as `fix-<strategy-name>`:

- `fix-comment` - Add TODO comments marking issues for later fixing
- `fix-conservative` - Fix only clear-cut, low-risk issues that won't require cascading changes
- `fix-zealot` - Pick one important issue and fix it comprehensively, even if it requires major reorganization

## Workflow

The typical workflow involves two steps:

1. **Critique**: Use a critic tool to analyze code and identify issues
2. **Fix**: Apply a fixer strategy to address the identified problems

### Step 1: Critique Code
```
"Use review-design to analyze this React component"
"Apply review-c-memory to check this malloc usage" 
"Run review-sql-security on this database query"
```

### Step 2: Apply Fixes
```
"Use fix-conservative to address the issues found"
"Apply fix-comment to mark the problems for later"
"Use fix-zealot to completely fix the memory management issue"
```

## Usage

### Critic Tool Parameters
- `code` (required): The code or project content to review
- `language` (optional): Programming language or context (default: "unknown") 
- `filePath` (optional): Path to the file being reviewed

### Fixer Tool Parameters
- `code` (required): The original code that was reviewed
- `critiqueResults` (required): The results from the critic analysis
- `language` (optional): Programming language or context (default: "unknown")
- `filePath` (optional): Path to the file being fixed

### Example Usage with VS Code Copilot

```
"Use review-design to analyze this React component"
"Apply review-c-memory to check this malloc usage" 
"Run review-sql-security on this database query"
"Use review-algorithm-performance to optimize this sorting function"
"Apply fix-conservative to address the issues found"
"Use fix-zealot to completely restructure this code"
```

## How It Works

### Critic Tools
1. **Explicit Selection**: Users explicitly request a specific critic by name
2. **Framework Embedding**: The complete critic framework content is included in the prompt
3. **Code Analysis**: The critic framework is applied to analyze the provided code  
4. **Issue Identification**: Results include specific problems and suggestions

### Fixer Tools
1. **Strategy Selection**: Users choose a fixing approach (comment, conservative, or zealot)
2. **Context Integration**: The fixer receives both the original code and critic results
3. **Strategic Application**: The chosen strategy is applied to address the identified issues
4. **Code Generation**: Returns modified code or instructions based on the strategy

## Integration with VS Code Copilot

Add this server to your MCP configuration to use it with VS Code Copilot. The server provides:

1. **Critic Tools**: Comprehensive analysis using specialized frameworks
2. **Fixer Tools**: Automated approaches to address identified issues
3. **Complete Context**: All necessary framework content and analysis results included in prompts
4. **Flexible Workflow**: Choose the appropriate critic and fixer combination for your needs

## Development

### Running the Server
- `npm start` - Run the server
- `npm run dev` - Run in development mode

### Testing
- `npm test` - Run all test suites
- `npm run test:mcp` - Run MCP protocol validation
- `npm run test:comprehensive` - Run comprehensive feature tests

### Utilities
- `npm run status` - Display server capabilities and status
- `npm run check` - Check VS Code integration readiness

### Project Structure
```
mcp-review/
├── src/           # Server implementation
├── tests/         # Test suites
├── scripts/       # Utility scripts  
├── ai-review/     # Critic and fixer frameworks (submodule)
└── README.md      # This file
```

## Credit

Critic frameworks provided by the [ai-review](https://dev.begriffs.com/git/ai-review) repository by Joe Nelson.
