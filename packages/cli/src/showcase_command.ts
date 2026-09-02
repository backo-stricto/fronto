import * as path from 'path';
import * as fileSystem from 'fs';
import * as core from '@backo-stricto/fronto-core';
import * as tui from './common.js';
import pc from 'picocolors';
import { exit } from 'process';


function do_showcase(frontoComponentsPath: string, projectRootPath: string): void {
    tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Running showcase application `);
    tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Fronto components path [${pc.inverse(frontoComponentsPath)}]`);
    tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Project root [${pc.inverse(projectRootPath)}]`);
    // Check if the project root path exists
    if (!fileSystem.existsSync(projectRootPath)) {
        tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.error()} Error: Project root path does not exist: ${pc.inverse(projectRootPath)}`);
        exit(1);
    }
    // Check if the fronto components path exists
    if (!fileSystem.existsSync(frontoComponentsPath)) {
        tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.error()} Error: Fronto components path does not exist: ${pc.inverse(frontoComponentsPath)}`);
        exit(1);
    }
    // Check if the showcase application entry point exists in the project root path
    const showcaseEntryPointPath: string = path.join(projectRootPath, 'showcase', 'index.html');
    // if showcase entry point exists, erase it and create a new one, otherwise create a new one
    if (fileSystem.existsSync(showcaseEntryPointPath)) {
        tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Deleting existing showcase entry point at ${pc.inverse(showcaseEntryPointPath)}...`);
        fileSystem.rmSync(showcaseEntryPointPath, { recursive: true, force: true });
    }
    // Create the showcase entry point
    tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Creating showcase entry point at ${pc.inverse(showcaseEntryPointPath)}...`);
    const showcaseDirPath: string = path.join(projectRootPath, 'showcase');
    fileSystem.mkdirSync(showcaseDirPath, { recursive: true });
    // Retrieve the path to the showcase assets from the Fronto @backo-stricto/fronto-vue package
    const frontoVuePackagePath: string = path.dirname(require.resolve('@backo-stricto/fronto-vue/package.json'));
    const showcaseAssetsPath: string = path.join(frontoVuePackagePath, 'src', 'showcase');
    // Copy the showcase assets to the project root path
    tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Copying showcase assets: ${pc.inverse(showcaseAssetsPath)} \u279c ${pc.inverse(showcaseDirPath)}...`);
    fileSystem.cpSync(showcaseAssetsPath, showcaseDirPath, { recursive: true });
    tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.info()} Showcase entry point created successfully at ${pc.inverse(showcaseEntryPointPath)}.`);
    // Generate the showcase registry file
    generate_showcase_registry_file(frontoComponentsPath, projectRootPath);
}

function generate_showcase_registry_file(frontoComponentsPath: string, projectRootPath: string): void {
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
