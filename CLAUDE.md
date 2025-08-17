# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment

**Environment**: WSL Ubuntu
**Development Server**: Always running at http://localhost:3000

- Server is started with `pnpm dev` and runs continuously
- Access the application directly via the network URL above
- Hot reload is enabled for development changes

## Development Commands

- `pnpm dev` - Start development server (usually already running)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting

## Project Architecture

### Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.1.9
- **UI Components**: Radix UI primitives with shadcn/ui
- **Database**: Supabase
- **Search**: Meilisearch
- **State Management**: React Context (cart, compare, quotes, wishlist)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Directory Structure

```
app/                    # Next.js app router pages
├── account/           # User account pages (orders, settings, wishlist)
├── auth/              # Authentication pages
├── bulk/              # Bulk order functionality
├── cart/              # Shopping cart
├── category/          # Product categories
├── checkout/          # Checkout process
├── product/           # Product detail pages
├── search/            # Search functionality
├── shop/              # Product listing
└── support/           # Contact and support

components/            # Reusable components
├── auth/              # Authentication components
├── bulk/              # Bulk order components
├── cart/              # Shopping cart components
├── compare/           # Product comparison
├── product/           # Product-related components
├── trust/             # Trust signals and testimonials
├── ui/                # shadcn/ui components
└── whatsapp/          # WhatsApp integration

lib/                   # Utility libraries
├── search/            # Meilisearch client and utilities
└── supabase/          # Supabase configuration
```

### Key Features

- **E-commerce Platform**: B2B refurbished laptop marketplace
- **Product Comparison**: Side-by-side product comparison with persistent tray
- **Bulk Orders**: Quote management system for bulk purchases
- **Search**: Advanced search with Meilisearch integration
- **Authentication**: Supabase-based user authentication
- **Cart Management**: Persistent shopping cart with context
- **WhatsApp Integration**: Customer support via WhatsApp
- **Accessibility**: Comprehensive a11y features including contrast toggle and skip links
- **Trust Elements**: Customer testimonials and trust signals

### Data Layer

- **Products**: Static product data in `/lib/products.ts`
- **Cart**: React Context with localStorage persistence
- **Compare**: React Context for product comparison
- **Quotes**: Context for bulk order quote management
- **Search**: Meilisearch for product search functionality

### Styling Approach

- Tailwind CSS with dark mode support via `next-themes`
- shadcn/ui component system with Radix UI primitives
- Custom CSS variables for theming
- Responsive design with mobile-first approach
- Focus on accessibility and high contrast mode support

### Business Logic

- Refurbished laptop marketplace targeting business customers
- 6-month warranty and expert testing messaging
- EMI payment options with Razorpay integration
- Bulk order workflow with quote management
- Customer trust building through testimonials and guarantees

## Available MCP Servers

### 1. Basic Memory (`basic-memory`)

**Purpose**: Knowledge base and memory management for project context
**Tools Available**:

- `mcp__basic-memory__read_note` - Read markdown notes by title/permalink
- `mcp__basic-memory__write_note` - Create/update markdown notes with semantic content
- `mcp__basic-memory__search_notes` - Advanced search across all knowledge base content
- `mcp__basic-memory__edit_note` - Edit existing notes (append, prepend, find_replace, etc.)
- `mcp__basic-memory__delete_note` - Delete notes by title/permalink
- `mcp__basic-memory__list_directory` - Browse directory contents with filtering
- `mcp__basic-memory__build_context` - Build context from memory:// URIs for conversations
- `mcp__basic-memory__recent_activity` - Get recent activity across knowledge base
- `mcp__basic-memory__move_note` - Move notes and maintain links
- `mcp__basic-memory__canvas` - Create Obsidian canvas files for visualizations
- `mcp__basic-memory__sync_status` - Check file synchronization status

**How to Use**: Store project knowledge, meeting notes, architectural decisions, and contextual information that needs to persist across sessions.

### 2. Context7 (`context7`)

**Purpose**: Up-to-date library documentation and code examples
**Tools Available**:

- `mcp__context7__resolve-library-id` - Convert package names to Context7-compatible library IDs
- `mcp__context7__get-library-docs` - Fetch current documentation for any library

**How to Use**: Get current documentation for React, Next.js, Tailwind, or any other library used in the project. Always resolve library ID first before fetching docs.

### 3. DuckDuckGo (`duckduckgo`)

**Purpose**: Web search for general information and current events
**Tools Available**:

- `mcp__duckduckgo__duckduckgo_web_search` - Web search with filtering and region support (max 20 results)

**How to Use**: Search for programming solutions, documentation, best practices, or troubleshooting when local resources aren't sufficient.

### 4. Fetch (`fetch`)

**Purpose**: Web content retrieval and image processing
**Tools Available**:

- `mcp__fetch__imageFetch` - Retrieve URLs, extract markdown content, and process images automatically

**How to Use**: Fetch external documentation, process web content, or analyze web pages with image support.

### 5. Playwright (`playwright`)

**Purpose**: Browser automation and testing
**Tools Available**:

- `mcp__playwright__browser_navigate` - Navigate to URLs
- `mcp__playwright__browser_snapshot` - Capture accessibility snapshots
- `mcp__playwright__browser_click`, `mcp__playwright__browser_type` - Interact with elements
- `mcp__playwright__browser_take_screenshot` - Take screenshots
- `mcp__playwright__browser_evaluate` - Run JavaScript on pages
- Plus many more for comprehensive browser automation

**How to Use**: Test the application UI, capture screenshots for documentation, or automate browser interactions for testing.

### 6. Sequential Thinking (`sequential-thinking`)

**Purpose**: Step-by-step problem solving with adaptive thinking
**Tools Available**:

- `mcp__sequential-thinking__sequentialthinking` - Dynamic problem-solving through structured thoughts

**How to Use**: Break down complex problems, plan implementation steps, or work through challenging debugging scenarios.

### 7. Serena (`serena`)

**Purpose**: Advanced code analysis and semantic operations
**Tools Available**:

- `mcp__serena__find_symbol` - Find code symbols by name patterns
- `mcp__serena__get_symbols_overview` - Get high-level view of file symbols
- `mcp__serena__replace_symbol_body` - Replace entire symbol implementations
- `mcp__serena__search_for_pattern` - Flexible regex pattern search
- `mcp__serena__find_referencing_symbols` - Find where symbols are used
- `mcp__serena__insert_after_symbol`, `mcp__serena__insert_before_symbol` - Add code around symbols
- `mcp__serena__replace_regex` - Advanced regex-based replacements
- `mcp__serena__list_dir`, `mcp__serena__find_file` - Navigate project structure
- Memory management tools for project knowledge

**How to Use**: Efficiently navigate and modify code by working with semantic symbols rather than raw text. Ideal for refactoring, adding features, or understanding complex codebases.

### 8. Filesystem (`filesystem`)

**Purpose**: Direct file system operations and management
**Tools Available**:

- `mcp__filesystem__read_file` - Read complete file contents with encoding support
- `mcp__filesystem__read_multiple_files` - Read multiple files simultaneously
- `mcp__filesystem__write_file` - Create new files or overwrite existing ones
- `mcp__filesystem__edit_file` - Make line-based edits with git-style diff preview
- `mcp__filesystem__create_directory` - Create directories and nested structures
- `mcp__filesystem__list_directory` - Get detailed directory listings
- `mcp__filesystem__list_directory_with_sizes` - Directory listings with file sizes
- `mcp__filesystem__directory_tree` - Recursive tree view as JSON structure
- `mcp__filesystem__move_file` - Move or rename files and directories
- `mcp__filesystem__search_files` - Recursively search for files by pattern
- `mcp__filesystem__get_file_info` - Get detailed file/directory metadata
- `mcp__filesystem__list_allowed_directories` - Show accessible directories

**How to Use**: Direct file operations when you need low-level file system access, batch file operations, or when other tools don't provide the needed functionality.

### 9. Zen (`zen`) - **Use Gemini 2.5 Pro Model Only**

**Purpose**: Comprehensive AI workflows and multi-model analysis with advanced features
**Tools Available**:

- `mcp__zen__chat` - General chat and collaborative thinking
- `mcp__zen__thinkdeep` - Multi-stage investigation and reasoning workflows (default: max thinking)
- `mcp__zen__planner` - Interactive sequential planning for complex tasks
- `mcp__zen__consensus` - Multi-model consensus building for decisions
- `mcp__zen__codereview` - Step-by-step code review with expert analysis
- `mcp__zen__precommit` - Pre-commit validation workflows
- `mcp__zen__debug` - Root cause analysis and debugging workflows
- `mcp__zen__secaudit` - Comprehensive security audit workflows
- `mcp__zen__docgen` - Code documentation generation
- `mcp__zen__analyze` - Comprehensive code analysis workflows
- `mcp__zen__refactor` - Refactoring analysis and planning
- `mcp__zen__tracer` - Code tracing and dependency analysis
- `mcp__zen__testgen` - Test generation workflows
- `mcp__zen__challenge` - Critical thinking and assumption validation

**Model Configuration**:

- **Primary Model**: `gemini-2.5-pro` (1M tokens, extended thinking up to 32K tokens)
- **Alternative Models**: `gemini-2.0-flash` (ultra-fast), `o3`, `o3-mini`, `o4-mini`, `gpt4.1`
- **Auto Mode**: Claude automatically selects optimal model based on task complexity

**Thinking Modes** (Gemini models only):

- `minimal` (128 tokens) - Simple tasks, lowest cost
- `low` (2,048 tokens) - Basic reasoning
- `medium` (8,192 tokens) - **Default** for most development tasks
- `high` (16,384 tokens) - Complex problems, default for thinkdeep
- `max` (32,768 tokens) - Exhaustive reasoning, highest cost

**Advanced Features**:

- **Context Revival**: Maintains conversation context across Claude resets using continuation_id
- **Vision Support**: Analyze images, diagrams, screenshots (up to 20MB for Gemini)
- **Web Search Integration**: Models can request Claude perform searches for current documentation
- **Large Prompt Handling**: Automatically handles prompts >50K characters via file system
- **Multi-Model Workflows**: Seamlessly switch between models within conversations

**Usage Examples**:

```
# Let Claude pick optimal model
"Use zen to analyze the authentication module"

# Specify model explicitly
"Use zen with gemini-2.5-pro to review security with high thinking mode"

# Continue previous conversation
"Continue our discussion about the API design with continuation_id from previous chat"

# Vision analysis
"Analyze this architecture diagram with gemini-2.5-pro"

# Web search enabled analysis
"Debug this React error with current documentation searches enabled"
```

**How to Use**:

- For complex analysis requiring structured thinking and expert validation
- When you need persistent conversations across context resets
- For collaborative workflows between multiple AI models
- Always specify `gemini-2.5-pro` for maximum capability
- Use thinking modes to balance cost vs. quality based on task complexity

## MCP Usage Guidelines

1. **Serena First**: Use Serena tools for code navigation and modifications to minimize token usage
2. **Context7 for Docs**: Always get current library documentation instead of relying on potentially outdated knowledge
3. **Basic Memory for Persistence**: Store important project insights, decisions, and context in Basic Memory
4. **Zen for Complex Tasks**: Use Zen workflows for analysis, planning, and expert validation with Gemini 2.5 Pro
5. **Playwright for Testing**: Automate UI testing and capture screenshots for documentation
6. **Filesystem for Direct Operations**: Use filesystem tools for batch operations or when other tools don't suffice

## Advanced Zen Workflows

### Design → Review → Implement

```
Think hard about designing and developing a new product comparison feature. Review your design plans
with o3, taking in their suggestions but keep the feature-set realistic and doable without adding
bloat. Begin implementing and get a codereview done by Gemini Pro between implementation steps.
```

### Code → Review → Fix → Precommit

```
Implement a new bulk order quote system. Once done, codereview with gemini pro and o3 both and ask
them to critique your work. Fix medium to critical bugs/concerns/issues and perform a precommit
check with zen using gemini pro to confirm we're okay to publish.
```

### Debug → Analyze → Solution

```
Take a look at the cart persistence issue - users are losing cart items on page refresh. Think hard
and go over each relevant component, tallying it with the cart context logic. After initial
investigation, ask gemini pro to analyze the cart-related code and formulate a minimal fix.
```

### Refactor → Review → Implement → Test

```
Use zen to analyze the product search module for decomposition opportunities. The code is getting
hard to maintain and we need to break it down. Use gemini pro with high thinking mode to identify
code smells and suggest a modernization strategy. After reviewing the plan, implement changes and
generate comprehensive tests with zen.
```

## Tool Selection Guide

**Decision Flow:**

1. **Have a specific error/exception?** → Use `mcp__zen__debug`
2. **Want to find bugs/issues in code?** → Use `mcp__zen__codereview`
3. **Want to understand how code works?** → Use `mcp__zen__analyze`
4. **Need comprehensive test coverage?** → Use `mcp__zen__testgen`
5. **Want to refactor/modernize code?** → Use `mcp__zen__refactor`
6. **Have analysis that needs extension/validation?** → Use `mcp__zen__thinkdeep`
7. **Want to brainstorm or discuss?** → Use `mcp__zen__chat`

**Key Distinctions:**

- `analyze` vs `codereview`: analyze explains, codereview prescribes fixes
- `chat` vs `thinkdeep`: chat is open-ended, thinkdeep extends specific analysis
- `debug` vs `codereview`: debug diagnoses runtime errors, review finds static issues
- `testgen` vs `debug`: testgen creates test suites, debug finds and fixes issues
- `refactor` vs `codereview`: refactor suggests structural improvements, codereview finds bugs
- `refactor` vs `analyze`: refactor provides actionable steps, analyze provides understanding
