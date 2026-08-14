import * as path from 'path';
import * as fileSystem from 'fs';
import * as url from 'url';
import * as core from '@backo-stricto/fronto-core';


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
    const destItemsPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_ITEMS_PATH);
    fileSystem.mkdirSync(destItemsPath, { recursive: true });
    const files: fileSystem.Dirent[] = fileSystem.readdirSync(sourceComponentsPath, { withFileTypes: true, recursive: true });
    const targetComponentsPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_BASE_PATH);
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
    const baseOverridesPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_OVERRIDES_BASE_PATH);
    core.FrontoVariants.forEach((variant: string) => {
        const variantOverridesPath: string = path.join(baseOverridesPath, variant);
        fileSystem.mkdirSync(variantOverridesPath, { recursive: true });
        console.log(`[INIT] Created items overrides directory for variant ${variant} at ${variantOverridesPath}`);
    });
    console.log(`[INIT] Created base overrides directory at ${baseOverridesPath}`);
    const itemsOverridesPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_OVERRIDES_ITEMS_PATH);
    fileSystem.mkdirSync(itemsOverridesPath, { recursive: true });
    console.log(`[INIT] Created items overrides directory at ${itemsOverridesPath}`);
}

export { do_init };
