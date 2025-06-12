import * as vscode from 'vscode';
import { Feature, ValidationResult } from '../services/featureGeneratorService';

export class WebviewProvider {
    private currentPanel: vscode.WebviewPanel | undefined = undefined;

    constructor(private context: vscode.ExtensionContext) {}

    /**
     * Shows validation results in a webview panel
     */
    public showValidationResults(validation: ValidationResult): void {
        const panel = this.createOrShowWebview('validation', 'Project Validation');
        panel.webview.html = this.getValidationHtml(validation);
    }

    /**
     * Shows feature overview in a webview panel
     */
    public showFeatureOverview(features: Feature[]): void {
        const panel = this.createOrShowWebview('overview', 'Feature Overview');
        panel.webview.html = this.getOverviewHtml(features);
    }

    private createOrShowWebview(type: string, title: string): vscode.WebviewPanel {
        if (this.currentPanel) {
            this.currentPanel.reveal(vscode.ViewColumn.One);
            return this.currentPanel;
        }

        this.currentPanel = vscode.window.createWebviewPanel(
            `featureGenerator.${type}`,
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.currentPanel.onDidDispose(
            () => {
                this.currentPanel = undefined;
            },
            null,
            this.context.subscriptions
        );

        // Handle messages from the webview
        this.currentPanel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'createFeature':
                        vscode.commands.executeCommand('featureGenerator.createFeature');
                        break;
                    case 'addUseCase':
                        vscode.commands.executeCommand('featureGenerator.addUseCase');
                        break;
                    case 'installDependencies':
                        vscode.commands.executeCommand('featureGenerator.installDependencies');
                        break;
                    case 'openFile':
                        if (message.filePath) {
                            vscode.window.showTextDocument(vscode.Uri.file(message.filePath));
                        }
                        break;
                }
            },
            undefined,
            this.context.subscriptions
        );

        return this.currentPanel;
    }

    private getValidationHtml(validation: ValidationResult): string {
        const statusIcon = validation.isValid ? '✅' : '⚠️';
        const statusText = validation.isValid ? 'Valid' : 'Issues Found';
        const statusColor = validation.isValid ? '#28a745' : '#ffc107';

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Validation</title>
            <style>
                ${this.getCommonStyles()}
                .status-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .status-badge {
                    background-color: ${statusColor};
                    color: white;
                    padding: 5px 15px;
                    border-radius: 15px;
                    font-weight: bold;
                }
                .issues-section, .recommendations-section {
                    margin: 20px 0;
                }
                .issue-item, .recommendation-item {
                    padding: 10px;
                    margin: 5px 0;
                    border-left: 4px solid;
                    background-color: var(--vscode-editor-background);
                }
                .issue-item {
                    border-left-color: #dc3545;
                }
                .recommendation-item {
                    border-left-color: #007acc;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-header">
                    <h1>${statusIcon} Project Validation</h1>
                    <span class="status-badge">${statusText}</span>
                </div>

                ${validation.issues.length > 0 ? `
                <div class="issues-section">
                    <h2>🚨 Issues Found (${validation.issues.length})</h2>
                    ${validation.issues.map(issue => `
                        <div class="issue-item">${issue}</div>
                    `).join('')}
                </div>
                ` : ''}

                ${validation.recommendations.length > 0 ? `
                <div class="recommendations-section">
                    <h2>💡 Recommendations (${validation.recommendations.length})</h2>
                    ${validation.recommendations.map(rec => `
                        <div class="recommendation-item">${rec}</div>
                    `).join('')}
                </div>
                ` : ''}

                <div class="features-summary">
                    <h2>📊 Project Summary</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${validation.features.length}</div>
                            <div class="stat-label">Features</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${validation.features.reduce((sum, f) => sum + f.useCases.length, 0)}</div>
                            <div class="stat-label">Use Cases</div>
                        </div>
                    </div>
                </div>

                ${validation.issues.length > 0 ? `
                <div class="actions">
                    <button onclick="installDependencies()" class="btn-primary">
                        🔧 Install Dependencies
                    </button>
                    <button onclick="createFeature()" class="btn-secondary">
                        ➕ Create Feature
                    </button>
                </div>
                ` : ''}
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                function installDependencies() {
                    vscode.postMessage({ command: 'installDependencies' });
                }
                
                function createFeature() {
                    vscode.postMessage({ command: 'createFeature' });
                }
            </script>
        </body>
        </html>`;
    }

    private getOverviewHtml(features: Feature[]): string {
        const totalUseCases = features.reduce((sum, feature) => sum + feature.useCases.length, 0);

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feature Overview</title>
            <style>
                ${this.getCommonStyles()}
                .feature-card {
                    border: 1px solid var(--vscode-widget-border);
                    border-radius: 8px;
                    padding: 15px;
                    margin: 10px 0;
                    background-color: var(--vscode-editor-background);
                }
                .feature-header {
                    display: flex;
                    justify-content: between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .feature-name {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: var(--vscode-foreground);
                }
                .use-case-count {
                    background-color: var(--vscode-badge-background);
                    color: var(--vscode-badge-foreground);
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.8em;
                }
                .use-cases-list {
                    margin-top: 10px;
                }
                .use-case-item {
                    padding: 5px 10px;
                    margin: 2px 0;
                    background-color: var(--vscode-input-background);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .use-case-item:hover {
                    background-color: var(--vscode-list-hoverBackground);
                }
                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: var(--vscode-descriptionForeground);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Feature Overview</h1>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${features.length}</div>
                            <div class="stat-label">Features</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${totalUseCases}</div>
                            <div class="stat-label">Use Cases</div>
                        </div>
                    </div>
                </div>

                ${features.length === 0 ? `
                <div class="empty-state">
                    <h2>🚀 No features yet</h2>
                    <p>Create your first feature to get started with clean architecture!</p>
                    <button onclick="createFeature()" class="btn-primary">
                        ➕ Create Your First Feature
                    </button>
                </div>
                ` : `
                <div class="features-list">
                    ${features.map(feature => `
                        <div class="feature-card">
                            <div class="feature-header">
                                <span class="feature-name">📁 ${feature.name}</span>
                                <span class="use-case-count">${feature.useCases.length} use cases</span>
                            </div>
                            
                            ${feature.useCases.length > 0 ? `
                            <div class="use-cases-list">
                                <strong>Use Cases:</strong>
                                ${feature.useCases.map(useCase => `
                                    <div class="use-case-item" onclick="openFile('${useCase.filePath}')">
                                        🔧 ${useCase.name}
                                    </div>
                                `).join('')}
                            </div>
                            ` : `
                            <div class="use-cases-list">
                                <em style="color: var(--vscode-descriptionForeground);">
                                    No use cases yet. Click "Add Use Case" to create one.
                                </em>
                            </div>
                            `}
                        </div>
                    `).join('')}
                </div>
                `}

                <div class="actions">
                    <button onclick="createFeature()" class="btn-primary">
                        ➕ Create Feature
                    </button>
                    <button onclick="addUseCase()" class="btn-secondary">
                        🔧 Add Use Case
                    </button>
                    <button onclick="installDependencies()" class="btn-secondary">
                        📦 Install Dependencies
                    </button>
                </div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                function createFeature() {
                    vscode.postMessage({ command: 'createFeature' });
                }
                
                function addUseCase() {
                    vscode.postMessage({ command: 'addUseCase' });
                }
                
                function installDependencies() {
                    vscode.postMessage({ command: 'installDependencies' });
                }
                
                function openFile(filePath) {
                    vscode.postMessage({ command: 'openFile', filePath: filePath });
                }
            </script>
        </body>
        </html>`;
    }

    private getCommonStyles(): string {
        return `
            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                margin-bottom: 30px;
            }
            h1, h2 {
                color: var(--vscode-foreground);
                margin-top: 0;
            }
            .stats-grid {
                display: flex;
                gap: 20px;
                margin: 20px 0;
            }
            .stat-card {
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-widget-border);
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                flex: 1;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                color: var(--vscode-textLink-foreground);
            }
            .stat-label {
                color: var(--vscode-descriptionForeground);
                margin-top: 5px;
            }
            .actions {
                margin-top: 30px;
                text-align: center;
            }
            .btn-primary, .btn-secondary {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 10px 20px;
                margin: 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            .btn-primary:hover, .btn-secondary:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .btn-secondary {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
            .btn-secondary:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }
        `;
    }
}