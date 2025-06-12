<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Feature Generator VS Code Extension

This is a VS Code extension project that provides a GUI interface for the Feature Generator CLI tool, which creates Clean Architecture features for Flutter/Dart projects.

## Extension Architecture

- **Main Extension** (`src/extension.ts`): Entry point, command registration, and activation
- **Feature Explorer** (`src/featureExplorer.ts`): Tree view provider for visualizing project structure
- **Service Layer** (`src/services/featureGeneratorService.ts`): Interfaces with the CLI tool and manages project analysis
- **Webview Provider** (`src/webview/webviewProvider.ts`): Rich UI panels for validation and overview

## Key Features

1. **Command Integration**: Wraps CLI commands (`create`, `add-usecase`, `install`, `validate`) with VS Code UI
2. **Tree View**: Hierarchical display of features, use cases, and architecture layers
3. **Webview Panels**: Interactive HTML panels for project validation and feature overview
4. **Project Analysis**: Real-time scanning of Flutter/Dart projects for features and use cases

## Development Guidelines

- Use the `get_vscode_api` tool with a query as input to fetch the latest VS Code API references
- Follow VS Code extension best practices for command registration and UI integration
- Ensure proper error handling and user feedback for CLI tool interactions
- Maintain consistency with VS Code's theming system in webview HTML/CSS

## CLI Integration

The extension depends on the `feature_generator` CLI tool being globally installed:

```bash
dart pub global activate feature_generator
```

All feature generation operations are delegated to the CLI tool via child process execution.
