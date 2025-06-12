# Feature Generator VS Code Extension

A powerful VS Code extension that provides a graphical interface for the Feature Generator CLI tool, enabling developers to create Clean Architecture features for Flutter/Dart projects with ease.

## 🚀 Features

### 🎯 **Command Integration**

- **Create Feature**: Generate complete Clean Architecture feature structure
- **Add Use Case**: Add individual use cases to existing features
- **Install Dependencies**: Set up core files and dependencies
- **Validate Project**: Check project structure and health
- **Feature Overview**: Interactive dashboard for project insights

### 🌳 **Feature Explorer Tree View**

- Hierarchical visualization of project structure
- Browse features, use cases, and architecture layers
- Quick navigation to use case files
- Real-time project analysis

### 📊 **Rich Webview Panels**

- **Project Validation**: Visual health check with actionable recommendations
- **Feature Overview**: Interactive dashboard with project statistics
- **One-click Actions**: Direct integration with CLI commands

### ⚙️ **Smart Configuration**

- Auto-detection of Flutter/Dart projects
- Configurable architecture patterns
- Automatic dependency installation
- Custom settings for workflow optimization

## 📋 Prerequisites

### Required

- **VS Code**: Version 1.74.0 or higher
- **Flutter/Dart**: Active Flutter or Dart project with `pubspec.yaml`
- **Feature Generator CLI**: Must be globally installed

### Install Feature Generator CLI

```bash
dart pub global activate feature_generator
```

Verify installation:

```bash
feature_generator --version
```

## 🔧 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Feature Generator"
4. Click "Install"

### From VSIX File

1. Download the `.vsix` file
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
4. Click "..." → "Install from VSIX..."
5. Select the downloaded file

## 🎮 Usage

### Getting Started

1. **Open a Flutter/Dart project** in VS Code
2. **Install dependencies** (if first time):
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Run: `Feature Generator: Install Dependencies`

### Creating Your First Feature

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Run**: `Feature Generator: Create Feature`
3. **Enter feature name** (e.g., "Auth", "User", "Dashboard")
4. **View in Explorer**: Check the "Features" tree view in the Explorer panel

### Adding Use Cases

1. **Right-click a feature** in the Features tree view
2. **Select**: "Add Use Case"
3. **Enter use case name** (e.g., "Login", "GetProfile", "UpdateSettings")

### Project Validation

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Run**: `Feature Generator: Validate Project`
3. **Review results** in the validation panel
4. **Apply fixes** using one-click actions

## 🏗️ Generated Structure

Each feature creates a complete Clean Architecture structure:

```
lib/features/YourFeature/
├── data/
│   ├── data_sources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── repositories/
│   └── use_cases/
└── presentation/
    ├── controllers/
    ├── views/
    └── widgets/
```

### Use Case Files

When adding a use case, the extension generates:

- **Use Case**: `domain/use_cases/usecase_name_use_case.dart`
- **Repository Interface**: `domain/repositories/usecase_name_repository.dart`
- **Repository Implementation**: `data/repositories/usecase_name_repo.dart`
- **Data Source**: `data/data_sources/usecase_name_data_source.dart`
- **Model**: `data/models/usecase_name_feature_model.dart`

## ⚙️ Configuration

### Extension Settings

```json
{
  "featureGenerator.defaultArchitecture": "clean",
  "featureGenerator.autoInstallDependencies": true,
  "featureGenerator.showNotifications": true
}
```

### Settings Description

- **`defaultArchitecture`**: Default architecture pattern (`clean`, `mvvm`, `mvc`)
- **`autoInstallDependencies`**: Auto-install dependencies when creating features
- **`showNotifications`**: Show success/error notifications

## 🎯 Commands

All commands are available through the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command                                   | Description                                            |
| ----------------------------------------- | ------------------------------------------------------ |
| `Feature Generator: Create Feature`       | Create a new feature with Clean Architecture structure |
| `Feature Generator: Add Use Case`         | Add a use case to an existing feature                  |
| `Feature Generator: Install Dependencies` | Install dependencies and set up core files             |
| `Feature Generator: Validate Project`     | Validate project structure and health                  |
| `Feature Generator: Feature Overview`     | Show interactive project dashboard                     |

## 🌳 Features Tree View

The Features tree view in the Explorer panel shows:

- **Features**: All features in your project
- **Use Cases**: Individual use cases per feature
- **Architecture Layers**: Data, Domain, and Presentation layers
- **File Navigation**: Click to open specific files

## 🔍 Troubleshooting

### CLI Not Found Error

**Error**: `Feature Generator CLI not found`

**Solution**:

```bash
# Install the CLI globally
dart pub global activate feature_generator

# Verify installation
feature_generator --version

# Check PATH configuration
echo $PATH | grep -o '[^:]*\.pub-cache[^:]*'
```

### Project Not Detected

**Error**: Extension not activating in your project

**Solution**:

1. Ensure your project has a `pubspec.yaml` file
2. Restart VS Code
3. Check that the project is a valid Flutter/Dart project

### Permission Issues

**Error**: Permission denied when creating files

**Solution**:

1. Check folder permissions
2. Run VS Code with appropriate permissions
3. Verify workspace folder access

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Compile TypeScript**: `npm run compile`
4. **Run tests**: `npm test`
5. **Debug**: Press `F5` in VS Code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **VS Code Marketplace**: [Feature Generator Extension](https://marketplace.visualstudio.com/items?itemName=your-publisher.feature-generator)
- **CLI Package**: [feature_generator on pub.dev](https://pub.dev/packages/feature_generator)
- **Documentation**: [Feature Generator Docs](https://pub.dev/documentation/feature_generator/latest/)
- **Issues**: [GitHub Issues](https://github.com/MOHAMED-ATEF2017/feature_generator/issues)

## 📊 Screenshots

### Features Tree View

The hierarchical view shows your project structure with features, use cases, and architecture layers.

### Validation Panel

Interactive validation results with one-click fixes for common issues.

### Feature Overview Dashboard

Comprehensive project statistics and quick actions for feature management.

---

**Made with ❤️ for the Flutter/Dart community**
# feature-generator-vscode-extension
