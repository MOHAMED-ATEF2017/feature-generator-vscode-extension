# Feature Generator VS Code Extension - Quick Fix Guide

## Problem: "Feature Generator: not found" Error

### ✅ **SOLUTION (Automatic)**

The extension now automatically handles this issue:

1. **Open your Flutter/Dart project** in VS Code
2. **Use any Feature Generator command** (e.g., "Create Feature")
3. **The extension automatically**:
   - Adds `feature_generator: ^2.4.1` to your `pubspec.yaml` dev_dependencies
   - Runs `flutter pub get` to install it
   - Uses `dart run feature_generator:feature_generator` for all operations

### 🛠️ **Manual Solution** (if preferred)

```yaml
# Add to your pubspec.yaml
dev_dependencies:
  feature_generator: ^2.4.1
```

Then run:
```bash
flutter pub get
```

### 💡 **Why This Approach Works**

- ✅ **Flutter SDK Context**: The CLI runs within your Flutter project context
- ✅ **No Global Issues**: Avoids global installation SDK conflicts  
- ✅ **Version Control**: Consistent across team members
- ✅ **Zero Setup**: Works automatically on first use

### 🚀 **How to Use After Fix**

1. **Create Feature**: `Ctrl+Shift+P` → `Feature Generator: Create Feature`
2. **Add Use Case**: Right-click feature in tree view → "Add Use Case"
3. **Validate Project**: `Ctrl+Shift+P` → `Feature Generator: Validate Project`

### 🔍 **Technical Details**

The extension now uses:
- `dart run feature_generator:feature_generator` instead of global commands
- Local dev dependency installation
- Proper Flutter project context

**Result**: The "Feature Generator: not found" error is completely resolved! 🎉
