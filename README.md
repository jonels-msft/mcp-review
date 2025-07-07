# MCP Review Server

A comprehensive Model Context Protocol (MCP) server that provides specialized code review capabilities using expert critic frameworks.

## Features

- **36+ Specialized Critics**: Each critic focuses on specific aspects of code quality
- **Explicit Invocation**: Users explicitly choose which critic to apply to their code
- **Expert Frameworks**: Uses proven critic methodologies from ai-review repository
- **Clean Integration**: Leverages VS Code Copilot's agentic capabilities for file reading

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

## Available Critics

The server automatically loads all critic frameworks from the `ai-review/critic` directory and exposes them as tools. Each critic is available as `critique_<critic-name>`:

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

## Usage

### Parameters (all critics)
- `code` (required): The code or project content to review
- `language` (optional): Programming language or context (default: "unknown") 
- `filePath` (optional): Path to the file being reviewed

### Example Usage with VS Code Copilot

```
"Use critique_design to review this React component"
"Apply critique_c-memory to analyze this malloc usage" 
"Run critique_sql-security on this database query"
"Use critique_algorithm-performance to check this sorting function"
```

## How It Works

1. **Explicit Selection**: Users explicitly request a specific critic by name
2. **Framework Embedding**: The complete critic framework content is included in the prompt
3. **Code Analysis**: The critic framework is applied to analyze the provided code  
4. **Comprehensive Review**: Results follow the specific methodology of the chosen critic

## Integration with VS Code Copilot

Add this server to your MCP configuration to use it with VS Code Copilot. When a critic tool is invoked, the server provides the complete critic framework content along with the code to be reviewed, ensuring the agent has all necessary context regardless of the user's project workspace.

## Development

- `npm start` - Run the server
- `npm run dev` - Run in development mode

## Credit

Critic frameworks provided by the [ai-review](https://dev.begriffs.com/git/ai-review) repository by Joe Nelson.
