import * as vscode from 'vscode';
import * as path from 'path';
import { FeatureGeneratorService, Feature, UseCase } from './services/featureGeneratorService';

export class FeatureExplorerProvider implements vscode.TreeDataProvider<FeatureItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<FeatureItem | undefined | null | void> = new vscode.EventEmitter<FeatureItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<FeatureItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private featureService: FeatureGeneratorService) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FeatureItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: FeatureItem): Promise<FeatureItem[]> {
        if (!element) {
            // Root level - show features
            const features = await this.featureService.getFeatures();
            if (features.length === 0) {
                return [new FeatureItem(
                    'No features found',
                    vscode.TreeItemCollapsibleState.None,
                    'info'
                )];
            }
            return features.map(feature => new FeatureItem(
                feature.name,
                vscode.TreeItemCollapsibleState.Expanded,
                'feature',
                feature
            ));
        } else if (element.contextValue === 'feature' && element.feature) {
            // Feature level - show use cases and structure
            const items: FeatureItem[] = [];
            
            // Add use cases section
            if (element.feature.useCases.length > 0) {
                const useCasesSection = new FeatureItem(
                    'Use Cases',
                    vscode.TreeItemCollapsibleState.Expanded,
                    'useCasesSection',
                    element.feature
                );
                items.push(useCasesSection);
            }
            
            // Add architecture sections
            items.push(
                new FeatureItem('Data Layer', vscode.TreeItemCollapsibleState.Collapsed, 'dataLayer'),
                new FeatureItem('Domain Layer', vscode.TreeItemCollapsibleState.Collapsed, 'domainLayer'),
                new FeatureItem('Presentation Layer', vscode.TreeItemCollapsibleState.Collapsed, 'presentationLayer')
            );
            
            return items;
        } else if (element.contextValue === 'useCasesSection' && element.feature) {
            // Use cases section - show individual use cases
            return element.feature.useCases.map(useCase => new FeatureItem(
                useCase.name,
                vscode.TreeItemCollapsibleState.None,
                'useCase',
                undefined,
                useCase
            ));
        } else if (element.contextValue === 'dataLayer') {
            return [
                new FeatureItem('Data Sources', vscode.TreeItemCollapsibleState.None, 'folder'),
                new FeatureItem('Models', vscode.TreeItemCollapsibleState.None, 'folder'),
                new FeatureItem('Repositories', vscode.TreeItemCollapsibleState.None, 'folder')
            ];
        } else if (element.contextValue === 'domainLayer') {
            return [
                new FeatureItem('Entities', vscode.TreeItemCollapsibleState.None, 'folder'),
                new FeatureItem('Repositories', vscode.TreeItemCollapsibleState.None, 'folder'),
                new FeatureItem('Use Cases', vscode.TreeItemCollapsibleState.None, 'folder')
            ];
        } else if (element.contextValue === 'presentationLayer') {
            return [
                new FeatureItem('Controllers/Cubits', vscode.TreeItemCollapsibleState.None, 'folder'),
                new FeatureItem('Views', vscode.TreeItemCollapsibleState.None, 'folder'),
                new FeatureItem('Widgets', vscode.TreeItemCollapsibleState.None, 'folder')
            ];
        }
        
        return [];
    }
}

export class FeatureItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string,
        public readonly feature?: Feature,
        public readonly useCase?: UseCase,
        public readonly parent?: FeatureItem
    ) {
        super(label, collapsibleState);
        
        this.tooltip = this.getTooltip();
        this.iconPath = this.getIcon();
        this.command = this.getCommand();
    }

    private getTooltip(): string {
        switch (this.contextValue) {
            case 'feature':
                return `Feature: ${this.label}\nUse Cases: ${this.feature?.useCases.length || 0}`;
            case 'useCase':
                return `Use Case: ${this.label}`;
            case 'dataLayer':
                return 'Data layer - handles external data sources and repositories';
            case 'domainLayer':
                return 'Domain layer - contains business logic and entities';
            case 'presentationLayer':
                return 'Presentation layer - UI components and state management';
            default:
                return this.label;
        }
    }

    private getIcon(): vscode.ThemeIcon | undefined {
        switch (this.contextValue) {
            case 'feature':
                return new vscode.ThemeIcon('folder-library');
            case 'useCase':
                return new vscode.ThemeIcon('symbol-method');
            case 'useCasesSection':
                return new vscode.ThemeIcon('list-unordered');
            case 'dataLayer':
                return new vscode.ThemeIcon('database');
            case 'domainLayer':
                return new vscode.ThemeIcon('gear');
            case 'presentationLayer':
                return new vscode.ThemeIcon('browser');
            case 'folder':
                return new vscode.ThemeIcon('folder');
            case 'info':
                return new vscode.ThemeIcon('info');
            default:
                return undefined;
        }
    }

    private getCommand(): vscode.Command | undefined {
        if (this.contextValue === 'useCase' && this.useCase) {
            return {
                command: 'vscode.open',
                title: 'Open Use Case',
                arguments: [vscode.Uri.file(this.useCase.filePath)]
            };
        }
        return undefined;
    }
}