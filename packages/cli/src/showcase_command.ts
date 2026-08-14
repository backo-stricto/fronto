import * as path from 'path';
import * as fileSystem from 'fs';
import * as core from '@backo-stricto/fronto-core';
import { exit } from 'process';


function do_showcase(frontoComponentsPath: string, projectRootPath: string): void {
    console.log(`[SHOWCASE] Running showcase application for project at ${projectRootPath} with Fronto components at ${frontoComponentsPath}...`);
    // Check if the project root path exists
    if (!fileSystem.existsSync(projectRootPath)) {
        console.error(`[SHOWCASE] Project root path does not exist: ${projectRootPath}`);
        exit(1);
    }
    // Check if the fronto components path exists
    if (!fileSystem.existsSync(frontoComponentsPath)) {
        console.error(`[SHOWCASE] Fronto components path does not exist: ${frontoComponentsPath}`);
        exit(1);
    }
    // Check if the showcase application entry point exists in the project root path
    const showcaseEntryPointPath: string = path.join(projectRootPath, 'showcase', 'index.html');
    // if showcase entry point exists, erase it and create a new one, otherwise create a new one
    if (fileSystem.existsSync(showcaseEntryPointPath)) {
        console.log(`[SHOWCASE] Showcase entry point already exists at ${showcaseEntryPointPath}. Deleting it...`);
        fileSystem.rmSync(showcaseEntryPointPath, { recursive: true, force: true });
    }
    // Create the showcase entry point
    console.log(`[SHOWCASE] Creating showcase entry point at ${showcaseEntryPointPath}...`);
    const showcaseDirPath: string = path.join(projectRootPath, 'showcase');
    fileSystem.mkdirSync(showcaseDirPath, { recursive: true });
    // Retrieve the path to the showcase assets from the Fronto @backo-stricto/fronto-vue package
    const frontoVuePackagePath: string = path.dirname(require.resolve('@backo-stricto/fronto-vue/package.json'));
    const showcaseAssetsPath: string = path.join(frontoVuePackagePath, 'src', 'showcase');
    // Copy the showcase assets to the project root path
    console.log(`[SHOWCASE] Copying showcase assets from ${showcaseAssetsPath} to ${showcaseDirPath}...`);
    fileSystem.cpSync(showcaseAssetsPath, showcaseDirPath, { recursive: true });
    console.log(`[SHOWCASE] Showcase entry point created successfully at ${showcaseEntryPointPath}.`);
    // Generate the showcase registry file
    generate_showcase_registry_file(projectRootPath, frontoComponentsPath);
}

function generate_showcase_registry_file(projectRootPath: string, frontoComponentsPath: string): void {
    // create the file showcase_registry.ts file in the project directory if it doesn't exist
    const showcaseRegistryFilePath: string = path.join(projectRootPath, 'showcase', 'registry.ts');
    if (!fileSystem.existsSync(showcaseRegistryFilePath)) {
        // create the file
        fileSystem.writeFileSync(showcaseRegistryFilePath, '');
    } else {
        // Empty the file if it already exists
        fileSystem.writeFileSync(showcaseRegistryFilePath, '', { flag: 'w' });
    }
    // compute the relative path from the showcase registry file path to the fronto components registry file path
    const relativePath: string = path.relative(path.dirname(showcaseRegistryFilePath), frontoComponentsPath);
    // add the generated code notice to the top of the file
    fileSystem.writeFileSync(showcaseRegistryFilePath, `${core.FRONTO_GENERATED_CODE_NOTICE}\n\n`, { flag: 'a' });
    // add the import statement to the showcase_registry.ts file
    const exportStatement: string = `export { FRONTO_COMPONENTS_REGISTRY, resolveFrontoComponent } from '${relativePath}/registry'\n`;
    fileSystem.writeFileSync(showcaseRegistryFilePath, exportStatement, { flag: 'a' });
}

export { do_showcase };
