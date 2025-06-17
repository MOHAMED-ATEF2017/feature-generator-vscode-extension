# Flut### 🎯 **Super Simple Workflow**

1. **Right-click on your `lib` folder** → Select "**Create Feature**"
2. **Right-click on any feature folder** → Select "**Add Use Case**"
3. **That's it!** Your Clean Architecture code is ready to use.

### 🚀 **What You Get**ture Generator - Clean Architecture Made Easy

A VS Code extension that makes creating Clean Architecture features for Flutter/Dart projects as simple as a right-click. Generate complete features and use cases instantly with smart dependency management.

## ✨ Quick Start - Right-Click to Create!

### � **Super Simple Workflow**

1. **Right-click on your `lib` folder** → Select "**Create Feature**"
2. **Right-click on any feature folder** → Select "**Add Use Case**"
3. **That's it!** Your Clean Architecture code is ready to use.

### � **What You Get**

- ✅ Complete Clean Architecture structure (data, domain, presentation layers)
- ✅ All necessary files generated automatically
- ✅ Dependencies installed only when needed
- ✅ Service locator setup handled for you
- ✅ Tree view to visualize your project structure

## 📋 Prerequisites

- **VS Code** 1.74.0+
- **Flutter/Dart project** with `pubspec.yaml`
- That's it! No manual CLI installation needed.

## 🔧 Installation

### From VS Code Marketplace

1. Open Extensions (`Ctrl+Shift+X`)
2. Search "**Feature Generator**"
3. Click "**Install**"

### From VSIX File

1. Extensions panel → "..." → "**Install from VSIX...**"
2. Select the `.vsix` file

## 🎮 How to Use

### 🆕 Create Your First Feature

1. **Right-click** on your project's `lib` folder in VS Code Explorer
2. Select **"Create Feature"** from the context menu
3. Enter feature name (e.g., "auth", "profile", "dashboard")
4. ✅ **Done!** Your feature structure is created automatically

### ➕ Add Use Cases to Features

1. **Right-click** on any feature folder (e.g., `lib/features/auth/`)
2. Select **"Add Use Case"** from the context menu  
3. Enter use case name (e.g., "login", "signup", "logout")
4. ✅ **Done!** All related files are generated

### 🔍 View Your Project Structure

- Check the **"Features"** tree view in the Explorer panel
- Click on any file to open it
- See all your features, use cases, and layers organized

### 🛠️ Alternative Commands (Optional)

You can also use the Command Palette (`Ctrl+Shift+P`):
- `Feature Generator: Create Feature`
- `Feature Generator: Add Use Case`
- `Feature Generator: Validate Project`

## 🏗️ What Gets Generated

### 📁 Complete Feature Structure

When you create a feature, you get this clean structure:

```
lib/features/your_feature/
├── data/
│   ├── data_sources/           # API and local data handling
│   ├── models/                 # Data models and DTOs
│   └── repositories/           # Repository implementations
├── domain/
│   ├── repositories/           # Repository contracts
│   └── use_cases/             # Business logic
└── presentation/
    ├── controllers/            # State management
    ├── views/                 # UI screens
    └── widgets/               # Reusable UI components
```

### 📄 Use Case Files Generated

When you add a use case (e.g., "login"), you automatically get:

- **Use Case**: `domain/use_cases/login_use_case.dart` - Business logic
- **Repository Interface**: `domain/repositories/login_repository.dart` - Contract
- **Repository Implementation**: `data/repositories/login_repo.dart` - Implementation  
- **Data Source**: `data/data_sources/login_data_source.dart` - API/Local data
- **Model**: `data/models/login_feature_model.dart` - Data structures

### 🔧 Smart Dependency Management

The extension automatically handles:
- ✅ Installing required packages (`get_it`, `dartz`, etc.) on first use
- ✅ Setting up service locator (`core/service_locator.dart`)
- ✅ No manual setup required!

## 📊 Features Overview

### 🌳 **Features Tree View**
- Hierarchical view of all your features in the Explorer panel
- Click any file to open it instantly
- See use cases organized by feature
- Navigate between data, domain, and presentation layers

### 🔍 **Project Validation** 
- Check your project structure health
- Get recommendations for improvements
- One-click fixes for common issues

### ⚙️ **Smart Configuration**
- Auto-detects Flutter/Dart projects
- Configurable settings for your workflow
- No manual CLI setup required

## 🔧 Troubleshooting

### ❌ Common Issues & Solutions

#### "Feature not created" or "Command failed"
1. **Check your project**: Make sure you have a `pubspec.yaml` file
2. **Try Command Palette**: Use `Ctrl+Shift+P` → "Feature Generator: Create Feature"
3. **Check Output**: View → Output → Select "Feature Generator" from dropdown

#### Right-click options not showing
1. **Restart VS Code** after installing the extension
2. **Refresh Explorer**: Right-click in Explorer → Refresh
3. **Check folder**: Make sure you're right-clicking on `lib` or feature folders

#### Permission or file creation issues
1. **Check folder permissions** in your project directory
2. **Close and reopen** your project folder
3. **Try running VS Code as administrator** (if on Windows)

### 🐛 Still Having Issues?

1. **Check Output Panel**: View → Output → "Feature Generator"
2. **Report Issues**: [GitHub Issues](https://github.com/MOHAMED-ATEF2017/feature_generator/issues)
3. **Include**: VS Code version, OS, error messages, and output logs

## 🤝 Contributing & Support

### 💡 Feature Requests & Bug Reports
- **GitHub Issues**: [Report bugs or request features](https://github.com/MOHAMED-ATEF2017/feature_generator/issues)
- **Discussions**: Share ideas and get help from the community

### 🔗 Useful Links
- **Feature Generator CLI**: [pub.dev package](https://pub.dev/packages/feature_generator)
- **Documentation**: [Complete CLI docs](https://pub.dev/documentation/feature_generator/latest/)
- **VS Code Marketplace**: [Extension page](https://marketplace.visualstudio.com/items?itemName=your-publisher.feature-generator)

<!-- ### �️ Development Setup
```bash
git clone https://github.com/your-repo/feature-generator-vscode-extension
cd feature-generator-vscode-extension
npm install
npm run compile
# Press F5 in VS Code to debug
``` -->

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🎯 Made for Flutter developers who love Clean Architecture**

**⭐ If this extension helps you, please star the repo and leave a review!**
