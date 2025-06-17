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

        try {
            // Only ensure dependency if not already present
            await this.ensureFeatureGeneratorDependency();
            
            // Check if this is first time setup
            const isFirstTime = await this.isFirstTimeSetup();
            
            let command = `dart run feature_generator:feature_generator create --name ${featureName}`;
            if (installDeps || isFirstTime) {
                command += ' --install-deps';
            }

            await this.executeCommand(command);
            
            // Mark as no longer first time
            if (isFirstTime) {
                await this.markSetupComplete();
            }
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
            console.log(`Adding use case "${useCaseName}" to feature "${featureName}"`);
            await this.ensureFeatureGeneratorDependency();
            
            const command = `dart run feature_generator:feature_generator add-usecase --feature ${featureName} --usecase ${useCaseName}`;
            console.log(`Executing command: ${command}`);
            console.log(`Working directory: ${this.workspaceRoot}`);
            
            const result = await this.executeCommand(command);
            console.log(`Command result: ${result}`);
            
            // Check if data source was created
            const dataSourcePath = path.join(this.workspaceRoot, 'lib', 'features', featureName, 'data', 'data_sources', `${useCaseName.toLowerCase()}_data_source.dart`);
            if (fs.existsSync(dataSourcePath)) {
                console.log(`Data source created successfully: ${dataSourcePath}`);
            } else {
                console.warn(`Data source not found at: ${dataSourcePath}`);
            }
            
        } catch (error) {
            console.error(`Error in addUseCase: ${error}`);
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
            await this.ensureFeatureGeneratorDependency();
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
     * Ensures feature_generator is available as a dev dependency
     */
    private async ensureFeatureGeneratorDependency(): Promise<void> {
        const pubspecPath = path.join(this.workspaceRoot, 'pubspec.yaml');
        
        if (!fs.existsSync(pubspecPath)) {
            throw new Error('pubspec.yaml not found. Make sure you are in a Flutter/Dart project.');
        }

        let pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
        
        // Check if feature_generator is already in dev_dependencies
        if (pubspecContent.includes('feature_generator:')) {
            return; // Already present
        }

        // Add feature_generator to dev_dependencies
        if (pubspecContent.includes('dev_dependencies:')) {
            // Add to existing dev_dependencies section
            pubspecContent = pubspecContent.replace(
                /dev_dependencies:\s*\n/,
                'dev_dependencies:\n  feature_generator: ^2.4.1\n'
            );
        } else {
            // Add dev_dependencies section
            pubspecContent += '\ndev_dependencies:\n  feature_generator: ^2.4.1\n';
        }

        // Write updated pubspec.yaml
        fs.writeFileSync(pubspecPath, pubspecContent);

        // Run flutter pub get to install the dependency
        await execAsync('flutter pub get', { cwd: this.workspaceRoot });
        
        vscode.window.showInformationMessage('Added feature_generator as dev dependency and ran pub get');
    }

    /**
     * Executes a command in the workspace directory
     */
    private async executeCommand(command: string): Promise<string> {
        console.log(`Executing command: ${command}`);
        console.log(`Working directory: ${this.workspaceRoot}`);
        
        try {
            const { stdout, stderr } = await execAsync(command, {
                cwd: this.workspaceRoot,
                timeout: 60000, // 60 second timeout for feature generation
                env: process.env
            });

            console.log(`Command stdout: ${stdout}`);
            
            if (stderr && !stderr.includes('warning') && !stderr.includes('FINE:') && !stderr.includes('Building package')) {
                console.warn('Command stderr:', stderr);
            }

            return stdout;
        } catch (error: any) {
            console.error('Command execution error:', error);
            
            if (error.message.includes('command not found') || error.message.includes('not recognized')) {
                throw new Error(
                    'Flutter command not found. Please ensure:\n' +
                    '1. Flutter SDK is properly installed and in PATH\n' +
                    '2. Your project has a valid pubspec.yaml file\n' +
                    '3. Run "flutter pub get" to install dependencies'
                );
            }
            
            if (error.message.includes('Could not find package')) {
                throw new Error(
                    'Feature Generator dependency not found. The extension will automatically add it to your pubspec.yaml and run pub get.'
                );
            }
            
            throw new Error(`Command failed: ${error.message}`);
        }
    }

    /**
     * Checks if the Feature Generator CLI is available (either locally or globally)
     */
    async isCliInstalled(): Promise<boolean> {
        try {
            // First check if it's available as local dependency
            const pubspecPath = path.join(this.workspaceRoot, 'pubspec.yaml');
            if (fs.existsSync(pubspecPath)) {
                const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
                if (pubspecContent.includes('feature_generator:')) {
                    try {
                        await execAsync('dart run feature_generator:feature_generator', { 
                            cwd: this.workspaceRoot,
                            timeout: 10000 
                        });
                        return true;
                    } catch {
                        // Dependency might not be installed yet
                        return false;
                    }
                }
            }

            // If not available locally, we'll add it as dependency when needed
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

    /**
     * Checks if this is the first time setup for the project
     */
    private async isFirstTimeSetup(): Promise<boolean> {
        const libPath = path.join(this.workspaceRoot, 'lib');
        const corePathOld = path.join(libPath, 'core');
        const corePath = path.join(libPath, 'core', 'core_utils');
        
        // Check if core utilities already exist (indicates setup was done before)
        return !fs.existsSync(corePath) && !fs.existsSync(corePathOld);
    }

    /**
     * Marks the setup as complete by creating a marker file
     */
    private async markSetupComplete(): Promise<void> {
        const markerPath = path.join(this.workspaceRoot, '.vscode', 'feature_generator_setup.json');
        const markerDir = path.dirname(markerPath);
        
        if (!fs.existsSync(markerDir)) {
            fs.mkdirSync(markerDir, { recursive: true });
        }
        
        const setupInfo = {
            setupDate: new Date().toISOString(),
            version: '1.0.7'
        };
        
        fs.writeFileSync(markerPath, JSON.stringify(setupInfo, null, 2));
    }
}