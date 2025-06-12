import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface Feature {
    name: string;
    path: string;
    useCases: UseCase[];
}

export interface UseCase {
    name: string;
    filePath: string;
    feature: string;
}

export interface ValidationResult {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
    features: Feature[];
}

export class FeatureGeneratorService {
    private workspaceRoot: string;

    constructor() {
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    }

    /**
     * Creates a new feature using the CLI tool
     */
    async createFeature(featureName: string, installDeps: boolean = false): Promise<void> {
        if (!this.workspaceRoot) {
            throw new Error('No workspace folder found');
        }

        const config = vscode.workspace.getConfiguration('featureGenerator');
        const autoInstall = config.get<boolean>('autoInstallDependencies', true);

        try {
            let command = `feature_generator create --name ${featureName}`;
            if (installDeps || autoInstall) {
                command += ' --install-deps';
            }

            await this.executeCommand(command);
        } catch (error) {
            throw new Error(`Failed to create feature: ${error}`);
        }
    }

    /**
     * Adds a use case to an existing feature
     */
    async addUseCase(featureName: string, useCaseName: string): Promise<void> {
        if (!this.workspaceRoot) {
            throw new Error('No workspace folder found');
        }

        try {
            const command = `feature_generator add-usecase --feature ${featureName} --usecase ${useCaseName}`;
            await this.executeCommand(command);
        } catch (error) {
            throw new Error(`Failed to add use case: ${error}`);
        }
    }

    /**
     * Installs dependencies and sets up core files
     */
    async installDependencies(): Promise<void> {
        if (!this.workspaceRoot) {
            throw new Error('No workspace folder found');
        }

        try {
            const command = 'feature_generator install';
            await this.executeCommand(command);
        } catch (error) {
            throw new Error(`Failed to install dependencies: ${error}`);
        }
    }

    /**
     * Validates the project structure
     */
    async validateProject(): Promise<ValidationResult> {
        if (!this.workspaceRoot) {
            return {
                isValid: false,
                issues: ['No workspace folder found'],
                recommendations: ['Open a Flutter/Dart project in VS Code'],
                features: []
            };
        }

        try {
            // Check if this is a Flutter/Dart project
            const pubspecPath = path.join(this.workspaceRoot, 'pubspec.yaml');
            if (!fs.existsSync(pubspecPath)) {
                return {
                    isValid: false,
                    issues: ['No pubspec.yaml found'],
                    recommendations: ['This doesn\'t appear to be a Flutter/Dart project'],
                    features: []
                };
            }

            const features = await this.getFeatures();
            const issues: string[] = [];
            const recommendations: string[] = [];

            // Check for features directory
            const featuresDir = path.join(this.workspaceRoot, 'lib', 'features');
            if (!fs.existsSync(featuresDir)) {
                issues.push('No features directory found');
                recommendations.push('Create your first feature to get started');
            }

            // Check for core files
            const coreDir = path.join(this.workspaceRoot, 'lib', 'core');
            if (!fs.existsSync(coreDir)) {
                issues.push('Core directory missing');
                recommendations.push('Run "Install Dependencies" to set up core files');
            } else {
                const coreFiles = [
                    'lib/core/errors/failure.dart',
                    'lib/core/use_cases/use_case.dart',
                    'lib/core/utils/service_locator.dart'
                ];

                for (const file of coreFiles) {
                    if (!fs.existsSync(path.join(this.workspaceRoot, file))) {
                        issues.push(`Missing core file: ${file}`);
                    }
                }

                if (issues.some(issue => issue.includes('Missing core file'))) {
                    recommendations.push('Run "Install Dependencies" to restore missing core files');
                }
            }

            return {
                isValid: issues.length === 0,
                issues,
                recommendations,
                features
            };
        } catch (error) {
            return {
                isValid: false,
                issues: [`Validation error: ${error}`],
                recommendations: ['Try refreshing the project or check your setup'],
                features: []
            };
        }
    }

    /**
     * Gets all features in the project
     */
    async getFeatures(): Promise<Feature[]> {
        if (!this.workspaceRoot) {
            return [];
        }

        const featuresDir = path.join(this.workspaceRoot, 'lib', 'features');
        if (!fs.existsSync(featuresDir)) {
            return [];
        }

        try {
            const featureNames = fs.readdirSync(featuresDir)
                .filter(item => fs.statSync(path.join(featuresDir, item)).isDirectory());

            const features: Feature[] = [];

            for (const featureName of featureNames) {
                const featurePath = path.join(featuresDir, featureName);
                const useCases = await this.getUseCasesForFeature(featureName);

                features.push({
                    name: featureName,
                    path: featurePath,
                    useCases
                });
            }

            return features;
        } catch (error) {
            console.error('Error getting features:', error);
            return [];
        }
    }

    /**
     * Gets all use cases for a specific feature
     */
    private async getUseCasesForFeature(featureName: string): Promise<UseCase[]> {
        const useCasesDir = path.join(this.workspaceRoot, 'lib', 'features', featureName, 'domain', 'use_cases');
        
        if (!fs.existsSync(useCasesDir)) {
            return [];
        }

        try {
            const files = fs.readdirSync(useCasesDir)
                .filter(file => file.endsWith('_use_case.dart'));

            return files.map(file => {
                const useCaseName = file.replace('_use_case.dart', '');
                const displayName = useCaseName
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return {
                    name: displayName,
                    filePath: path.join(useCasesDir, file),
                    feature: featureName
                };
            });
        } catch (error) {
            console.error(`Error getting use cases for feature ${featureName}:`, error);
            return [];
        }
    }

    /**
     * Executes a command in the workspace directory
     */
    private async executeCommand(command: string): Promise<string> {
        try {
            const { stdout, stderr } = await execAsync(command, {
                cwd: this.workspaceRoot,
                timeout: 30000 // 30 second timeout
            });

            if (stderr && !stderr.includes('warning')) {
                throw new Error(stderr);
            }

            return stdout;
        } catch (error: any) {
            // Handle case where feature_generator CLI is not installed
            if (error.message.includes('command not found') || error.message.includes('not recognized')) {
                throw new Error(
                    'Feature Generator CLI not found. Please install it globally using:\n' +
                    'dart pub global activate feature_generator'
                );
            }
            throw error;
        }
    }

    /**
     * Checks if the Feature Generator CLI is installed
     */
    async isCliInstalled(): Promise<boolean> {
        try {
            await execAsync('feature_generator --version', { cwd: this.workspaceRoot });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Gets project statistics
     */
    async getProjectStats(): Promise<{
        totalFeatures: number;
        totalUseCases: number;
        featuresWithUseCases: number;
    }> {
        const features = await this.getFeatures();
        const totalUseCases = features.reduce((sum, feature) => sum + feature.useCases.length, 0);
        const featuresWithUseCases = features.filter(feature => feature.useCases.length > 0).length;

        return {
            totalFeatures: features.length,
            totalUseCases,
            featuresWithUseCases
        };
    }
}