# Change Log

All notable changes to the "Flutter Feature Generator Clean Code Architecture" extension will be documented in this file.

## [1.1.1] - 2025-06-17

### 🔧 Minor Fixes & Improvements

- **📝 README Polish**: Manual refinements to documentation formatting
- **🧹 Code Cleanup**: Cleaned up development setup section
- **✨ Final Touches**: Minor adjustments for better user experience

## [1.1.0] - 2025-06-17

### 📚 Documentation & UX Improvements

- **🎯 Simplified README**: Completely rewritten to focus on the right-click workflow
- **✨ User-Friendly Instructions**: Clear, step-by-step guide emphasizing ease of use
- **🚀 Quick Start Section**: Right-click workflow highlighted as the primary method
- **🔧 Better Troubleshooting**: Improved troubleshooting section with common solutions
- **📖 Enhanced Description**: Updated package description to highlight simplicity

### Key Highlights

- Right-click on `lib` folder → Create Feature
- Right-click on feature folder → Add Use Case  
- No manual CLI installation required
- Smart dependency management handled automatically

## [1.0.9] - 2025-06-17

### Enhanced

- **Enhanced Debugging**: Added comprehensive logging for use case creation
- **Data Source Verification**: Added automatic verification that data source files are created
- **Better Error Reporting**: Enhanced error messages with detailed command execution logs
- **Command Tracking**: Added logging for all CLI commands and their results

### Technical Improvements

- Added detailed console logging for `addUseCase` method
- Enhanced `executeCommand` method with comprehensive debugging
- Added file existence verification for created data sources
- Improved error handling with command output logging

### Note

Based on testing, the CLI correctly creates data source files when adding use cases. If you're experiencing issues with data sources not being created, the enhanced logging in this version will help identify the root cause.

## [1.0.8] - 2025-06-17

### Fixed

- **CRITICAL FIX**: Fixed "Add Use Case" right-click command not working
- Fixed dependency installation to only run on first time setup
- Fixed `addUseCase` method to use proper `dart run` command instead of global CLI
- Enhanced path parsing for Windows and Unix systems
- Added better error handling and debugging for use case creation

### Improved

- **Smart Dependency Management**: Only installs core dependencies on first project setup
- **Better Path Detection**: Enhanced feature name extraction from folder paths
- **Debugging Support**: Added console logging for troubleshooting
- **Error Handling**: Better error messages and user feedback

### Technical Changes

- Added `isFirstTimeSetup()` method to detect initial project setup
- Added `markSetupComplete()` method to track setup completion
- Enhanced cross-platform path handling (Windows/Unix)
- Improved command execution with proper dependency management

## [1.0.7] - 2025-06-17

### Fixed

- **CRITICAL FIX**: Resolved "feature_generator: not found" error in command execution
- Fixed `executeCommand` method to use proper `dart run` commands instead of global CLI
- Fixed `isCliInstalled` method to properly check for local dependencies
- Enhanced error handling for better debugging and user feedback

### Technical Improvements

- Updated command execution to use `dart run feature_generator:feature_generator`
- Improved timeout handling (increased to 60 seconds for feature generation)
- Better error messages for dependency-related issues
- Enhanced debugging output for troubleshooting

## [1.0.6] - 2025-06-17

### Fixed

- Fixed "Feature Generator: setup CLI" command to properly show setup dialog
- Enhanced right-click context menus for better user experience
- Resolved dependency management issues

### Added

- **Right-click context menu** on feature folders to add use cases
- **Right-click context menu** on lib/features folders to create new features
- Smart context detection for folder-specific actions
- Improved error handling for all commands

### Changed

- Renamed "Install Dependencies" to "Setup Dependencies" for clarity
- Enhanced folder path detection for right-click actions
- Improved user feedback messages
- Better command organization in context menus

### Technical Improvements

- Added `createFeatureInFolder` command for targeted feature creation
- Enhanced path parsing for feature name extraction from folder structure
- Improved TypeScript type safety in command handlers
- Better error handling with user-friendly messages
- Fixed `ensureFeatureGeneratorDependency` method implementation

## [1.0.3] - 2025-06-17

### Fixed

- Fixed "Feature Generator: setup CLI" command to properly show setup dialog
- Enhanced right-click context menus for better user experience

### Added

- **Right-click context menu** on feature folders to add use cases
- **Right-click context menu** on lib/features folders to create new features
- Smart context detection for folder-specific actions
- Improved error handling for all commands

### Changed

- Renamed "Install Dependencies" to "Setup Dependencies" for clarity
- Enhanced folder path detection for right-click actions
- Improved user feedback messages
- Better command organization in context menus

### Technical Improvements

- Added `createFeatureInFolder` command for targeted feature creation
- Enhanced path parsing for feature name extraction from folder structure
- Improved TypeScript type safety in command handlers
- Better error handling with user-friendly messages

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
