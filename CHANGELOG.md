# Change Log

All notable changes to the "Flutter Feature Generator Clean Code Architecture" extension will be documented in this file.

## [1.0.2] - 2025-06-15

### Fixed

- **CRITICAL FIX**: Resolved "Feature Generator: not found" error that affected all users
- Extension now automatically adds `feature_generator` as dev dependency to project
- Changed from global CLI installation to local project dependency approach
- Updated all commands to use `dart run feature_generator:feature_generator` instead of global calls
- Enhanced error handling with better user guidance and automatic dependency management

### Changed

- Improved CLI integration with automatic dependency installation
- Updated documentation with comprehensive troubleshooting guide
- Enhanced service layer with better error messages and user feedback
- Simplified setup process - zero manual configuration required

### Technical Details

- Modified `FeatureGeneratorService` to handle local dependencies
- Added `ensureFeatureGeneratorDependency()` method for automatic setup
- Updated `executeCommand()` with better error handling
- Changed timeout from 30s to 60s for feature generation operations

## [1.0.1] - 2025-06-13

### Changed

- Updated extension display name to "Flutter Feature Generator Clean Code Architecture"
- Added professional extension logo for better marketplace visibility
- Enhanced branding and visual identity

### Fixed

- Resolved OPC specification compliance issues in packaging
- Optimized package size with proper file exclusions

## [1.0.0] - 2025-06-12

### Added

- Initial release of Flutter Feature Generator Clean Code Architecture VS Code Extension
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
