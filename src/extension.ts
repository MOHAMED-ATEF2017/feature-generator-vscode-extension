import * as vscode from 'vscode';
// Update the import path if the file is named 'featureExplorer.ts' or 'featureExplorer.tsx' with the correct casing
import { FeatureExplorerProvider } from './featureExplorer';
// If the file is actually named 'FeatureExplorer.ts', use:
// import { FeatureExplorerProvider } from './FeatureExplorer';
import { FeatureGeneratorService } from './services/featureGeneratorService';
import { WebviewProvider } from './webview/webviewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Feature Generator extension is now active!');

    // Initialize services
    const featureService = new FeatureGeneratorService();
    const webviewProvider = new WebviewProvider(context);
    
    // Initialize tree view
    const featureExplorerProvider = new FeatureExplorerProvider(featureService);
    const treeView = vscode.window.createTreeView('featureGenerator.explorer', {
        treeDataProvider: featureExplorerProvider,
        showCollapseAll: true
    });

    // Register commands
    const commands = [
        vscode.commands.registerCommand('featureGenerator.createFeature', async () => {
            const featureName = await vscode.window.showInputBox({
                prompt: 'Enter feature name',
                placeHolder: 'e.g., Auth, User, Dashboard',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Feature name cannot be empty';
                    }
                    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
                        return 'Feature name must start with a letter and contain only letters and numbers';
                    }
                    return null;
                }
            });

            if (featureName) {
                await featureService.createFeature(featureName.trim());
                featureExplorerProvider.refresh();
                vscode.window.showInformationMessage(`Feature "${featureName}" created successfully!`);
            }
        }),

        vscode.commands.registerCommand('featureGenerator.addUseCase', async (item?) => {
            let featureName: string | undefined;
            
            if (item && item.contextValue === 'feature') {
                featureName = item.label;
            } else {
                const features = await featureService.getFeatures();
                if (features.length === 0) {
                    vscode.window.showErrorMessage('No features found. Create a feature first.');
                    return;
                }
                
                const quickPickItems = features.map(f => ({
                    label: f.name,
                    detail: `${f.useCases.length} use cases`
                }));
                
                const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
                    placeHolder: 'Select a feature to add use case to'
                });
                
                featureName = selectedItem?.label;
            }

            if (!featureName) return;

            const useCaseName = await vscode.window.showInputBox({
                prompt: `Enter use case name for feature "${featureName}"`,
                placeHolder: 'e.g., Login, GetProfile, UpdateSettings',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Use case name cannot be empty';
                    }
                    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(value)) {
                        return 'Use case name must start with a letter and contain only letters and numbers';
                    }
                    return null;
                }
            });

            if (useCaseName) {
                await featureService.addUseCase(featureName, useCaseName.trim());
                featureExplorerProvider.refresh();
                vscode.window.showInformationMessage(`Use case "${useCaseName}" added to feature "${featureName}"!`);
            }
        }),

        vscode.commands.registerCommand('featureGenerator.installDependencies', async () => {
            const result = await vscode.window.showInformationMessage(
                'This will install dependencies and set up core files. Continue?',
                'Yes', 'No'
            );
            
            if (result === 'Yes') {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Installing dependencies...',
                    cancellable: false
                }, async (progress) => {
                    progress.report({ increment: 0, message: 'Setting up core files...' });
                    await featureService.installDependencies();
                    progress.report({ increment: 100, message: 'Complete!' });
                });
                
                featureExplorerProvider.refresh();
                vscode.window.showInformationMessage('Dependencies installed successfully!');
            }
        }),

        vscode.commands.registerCommand('featureGenerator.validateProject', async () => {
            const validation = await featureService.validateProject();
            webviewProvider.showValidationResults(validation);
        }),

        vscode.commands.registerCommand('featureGenerator.showFeatureOverview', async () => {
            const features = await featureService.getFeatures();
            webviewProvider.showFeatureOverview(features);
        }),

        vscode.commands.registerCommand('featureGenerator.refreshExplorer', () => {
            featureExplorerProvider.refresh();
        })
    ];

    // Add all commands to subscriptions
    commands.forEach(command => context.subscriptions.push(command));
    
    // Add tree view to subscriptions
    context.subscriptions.push(treeView);

    // Show welcome message for first-time users
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            'Welcome to Feature Generator! Create clean architecture features for your Flutter/Dart projects.',
            'Get Started'
        ).then(selection => {
            if (selection === 'Get Started') {
                vscode.commands.executeCommand('featureGenerator.showFeatureOverview');
            }
        });
        context.globalState.update('hasShownWelcome', true);
    }
}

export function deactivate() {
    console.log('Feature Generator extension deactivated');
}