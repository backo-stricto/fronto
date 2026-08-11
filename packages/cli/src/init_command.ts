import * as path from 'path';
import * as fileSystem from 'fs';
import * as url from 'url';

const componentsBasePath = `fronto/components/base`;
const componentsItemsPath = `fronto/components/items`;
const componentsOverridesPath = `fronto/components/overrides`;


function do_init(projectPath: string, baseFramework: string): void {
    const choosenFramework: string = baseFramework.toLowerCase();
    const packageRoot = path.dirname(url.fileURLToPath(import.meta.resolve(`@backo-stricto/fronto-${choosenFramework}/package.json`)));
    const sourceComponentsPath = path.join(packageRoot, 'src/components');
    switch (baseFramework.toLowerCase()) {
        case 'vue':
            console.log(`[INIT] Initializing project at ${projectPath} with basic Vue Fronto components...`);
            break;
        default:
            console.error(`[INIT] Unsupported base framework: ${baseFramework}. Supported frameworks: vue`);
            return;
    }
    console.log(`[INIT] Initializing project at ${projectPath} with basic ${baseFramework} Fronto components...`);
    if (!fileSystem.statSync(projectPath, { throwIfNoEntry: false })) {
        fileSystem.mkdirSync(projectPath, { recursive: true });
    }
    const destItemsPath: string = path.join(projectPath, componentsItemsPath);
    fileSystem.mkdirSync(destItemsPath, { recursive: true });
    const files: fileSystem.Dirent[] = fileSystem.readdirSync(sourceComponentsPath, { withFileTypes: true, recursive: true });
    const targetComponentsPath: string = path.join(projectPath, componentsBasePath);
    fileSystem.mkdirSync(targetComponentsPath, { recursive: true });
    for (const file of files) {
        if (file.isFile()) {
            const componentsCategoryDir: string = file.parentPath.replace(sourceComponentsPath, '');
            const componentTargetPath: string = path.join(targetComponentsPath, componentsCategoryDir, file.name);
            console.log(`[INIT] Copying file ${file.parentPath}/${file.name} to ${componentTargetPath}`);
            fileSystem.mkdirSync(path.join(targetComponentsPath, componentsCategoryDir), { recursive: true });
            fileSystem.copyFileSync(path.join(file.parentPath, file.name), componentTargetPath);
        }
    }
    console.log(`[INIT] Project initialized successfully at ${projectPath}.`);
    const baseOverridesPath: string = path.join(projectPath, componentsOverridesPath, 'base');
    fileSystem.mkdirSync(baseOverridesPath, { recursive: true });
    console.log(`[INIT] Created base overrides directory at ${baseOverridesPath}`);
    const itemsOverridesPath: string = path.join(projectPath, componentsOverridesPath, 'items');
    fileSystem.mkdirSync(itemsOverridesPath, { recursive: true });
    console.log(`[INIT] Created items overrides directory at ${itemsOverridesPath}`);
}

export { do_init };
