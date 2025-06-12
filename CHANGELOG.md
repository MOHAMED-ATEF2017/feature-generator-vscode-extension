# Change Log

All notable changes to the "feature-generator" extension will be documented in this file.

## [1.0.0] - 2025-06-12

### Added

- Initial release of Feature Generator VS Code Extension
- **Command Integration**: Complete GUI wrapper for Feature Generator CLI

  - `Feature Generator: Create Feature` - Create new clean architecture features
  - `Feature Generator: Add Use Case` - Add use cases to existing features
  - `Feature Generator: Install Dependencies` - Set up core files and dependencies
  - `Feature Generator: Validate Project` - Check project structure and health
  - `Feature Generator: Feature Overview` - Interactive project dashboard

- **Feature Explorer Tree View**

  - Hierarchical visualization of project structure
  - Browse features, use cases, and architecture layers
  - Quick navigation to use case files
  - Real-time project analysis

- **Rich Webview Panels**

  - Project validation with actionable recommendations
  - Feature overview dashboard with statistics
  - One-click actions for common operations

- **Smart Configuration**
  - Auto-detection of Flutter/Dart projects
  - Configurable architecture patterns
  - Automatic dependency installation
  - Custom settings for workflow optimization

### Features

- Integration with Feature Generator CLI (requires global installation)
- Context-sensitive commands and menus
- Professional VS Code theming support
- Comprehensive error handling and user feedback
- Welcome experience for new users

### Requirements

- VS Code 1.74.0 or higher
- Flutter/Dart project with pubspec.yaml
- Feature Generator CLI globally installed (`dart pub global activate feature_generator`)

---

**Made with ❤️ for the Flutter/Dart community**
