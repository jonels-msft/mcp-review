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
Each critic is available as `critique_<critic-name>`:

### Design & UI Critics
- `critique_design` - UI and user experience review
- `critique_color` - Color usage and accessibility
- `critique_data-visualization` - Charts and data presentation

### Security Critics
- `critique_sql-security` - SQL injection and database security
- `critique_sql-data-integrity` - Data validation and constraints

### Performance Critics
- `critique_algorithm-performance` - Algorithm efficiency analysis
- `critique_algorithm-correctness` - Algorithm correctness verification
- `critique_logging-performance` - Logging overhead analysis

### Memory & Resource Management
- `critique_c-memory` - C memory management review
- `critique_c-error-handling` - C error handling patterns
- `critique_c-portability` - Cross-platform C code

### Error Handling
- `critique_general-error-handling` - Generic error handling best practices
- `critique_procedural-error` - Procedural error management

### Data & Logic
- `critique_procedural-data` - Data structure and flow analysis
- `critique_procedural-functions` - Function design and organization
- `critique_procedural-flow` - Control flow analysis
- `critique_floating-point` - Numerical precision and floating-point issues
- `critique_datetime` - Date/time handling correctness
- `critique_unicode` - Unicode and internationalization

### Standards & Compliance
- `critique_sql-standard-compliance` - SQL standard adherence
- `critique_posix` - POSIX compliance and portability
- `critique_unix-interface` - Unix philosophy and interfaces

### Development Practices
- `critique_logging-practices` - Logging strategy and implementation
- `critique_terminology` - Naming conventions and clarity
- `critique_writing` - Documentation and comments
- `critique_estimation` - Complexity and effort estimation
- `critique_benchmarking` - Performance measurement practices

### Specialized Critics
- `critique_meson` - Meson build system review
- `critique_probability` - Statistical and probabilistic code
- `critique_relational` - Database design and relationships
- `critique_prompting` - AI prompt engineering
- `critique_logicism` - Formal logic and reasoning
- `critique_taylorism` - Workflow and efficiency analysis

### Fixer Tools
Each fixer strategy is available as `fix_<strategy-name>`:

- `fix_comment` - Add TODO comments marking issues for later fixing
- `fix_conservative` - Fix only clear-cut, low-risk issues that won't require cascading changes
- `fix_zealot` - Pick one important issue and fix it comprehensively, even if it requires major reorganization

## Workflow

The typical workflow involves two steps:

1. **Critique**: Use a critic tool to analyze code and identify issues
2. **Fix**: Apply a fixer strategy to address the identified problems

### Step 1: Critique Code
```
"Use critique_design to review this React component"
"Apply critique_c-memory to analyze this malloc usage" 
"Run critique_sql-security on this database query"
```

### Step 2: Apply Fixes
```
"Use fix_conservative to address the issues found"
"Apply fix_comment to mark the problems for later"
"Use fix_zealot to completely fix the memory management issue"
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
"Use critique_design to review this React component"
"Apply critique_c-memory to analyze this malloc usage" 
"Run critique_sql-security on this database query"
"Use critique_algorithm-performance to check this sorting function"
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
