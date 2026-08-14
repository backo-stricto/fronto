import * as path from 'path';
import * as fileSystem from 'fs';
import * as core from '@backo-stricto/fronto-core';
import { exit } from 'process';


function do_scan(projectPath: string): void {
    const projectComponentsPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_BASE_PATH);
    console.log(`[SCAN] Scanning project at ${projectPath} for Fronto components...`);
    // Loop over the stricto types and variants defined in the core package and check if the corresponding component files exist in the project
    // let importStatement: string = ``;
    const baseComponentsRegistry: core.ComponentRegistry = {};
    core.StrictoTypes.forEach((strictoType: string) => {
        baseComponentsRegistry[strictoType] = {};
        core.FrontoVariants.forEach((variant: string) => {
            const componentFilePath: string = path.join(projectComponentsPath, variant, `${strictoType}.vue`);
            console.log(`[SCAN] Checking for component file: ${componentFilePath}`);
            // test if the component file exists
            if (fileSystem.existsSync(componentFilePath)) {
                console.log(`[SCAN] Found component file: ${componentFilePath}`);
                // importStatement = `import ${strictoType}${variant} from './base/${variant}/${strictoType}.vue'\n`;
                baseComponentsRegistry[strictoType][variant] ??= `./base/${variant}/${strictoType}.vue`;
                // test if Component has been overridden in the project by checking if the component file exists in the overrides directory
                const overrideComponentFilePath: string = path.join(projectPath, core.FRONTO_COMPONENTS_OVERRIDES_BASE_PATH, variant, `${strictoType}.vue`);
                if (fileSystem.existsSync(overrideComponentFilePath)) {
                    console.log(`[SCAN] Found override component file: ${overrideComponentFilePath}`);
                    // importStatement = `import ${strictoType}${variant} from './overrides/base/${variant}/${strictoType}.vue'\n`;
                    baseComponentsRegistry[strictoType][variant] = `./overrides/base/${variant}/${strictoType}.vue`;
                }
                // append the import statement to the registry.ts file
                // fileSystem.writeFileSync(registryFilePath, importStatement, { flag: 'a' });
            } else {
                console.log(`[SCAN] [WARN] Component file not found: ${componentFilePath}`);
            }
        });
        console.log(`[SCAN] - Scan completed for ${strictoType}.`);
        console.log(`[SCAN] - Base Components Registry: ${JSON.stringify(baseComponentsRegistry, null, 2)}`);
        generate_registry_file(projectPath, baseComponentsRegistry);
    })
}

function generate_registry_file(projectPath: string, registry: core.ComponentRegistry): void {
    // create the file registry.ts file in the project directory if it doesn't exist
    const registryFilePath: string = path.join(projectPath, core.FRONTO_COMPONENTS_ROOT_PATH, 'registry.ts');
    if (!fileSystem.existsSync(registryFilePath)) {
        // create the file
        fileSystem.writeFileSync(registryFilePath, '');
    } else {
        // Empty the file if it already exists
        fileSystem.writeFileSync(registryFilePath, '', { flag: 'w' });
    }
    // check if the file is empty
    const registryFileStats: fileSystem.Stats = fileSystem.statSync(registryFilePath);
    if (registryFileStats.size === 0) {
        // add the generated code notice to the top of the file
        fileSystem.writeFileSync(registryFilePath, `${core.FRONTO_GENERATED_CODE_NOTICE}\n\n`, { flag: 'a' });
    } else {
        console.log(`[SCAN] [WARN] Registry file already exists and is not empty: ${registryFilePath}`);
        exit(1);
    }
    // add the import statements for each component in the registry
    Object.keys(registry).forEach((strictoType: string) => {
        Object.keys(registry[strictoType]).forEach((variant: string) => {
            const componentPath: string = registry[strictoType][variant];
            const importStatement: string = `import ${strictoType}${variant} from '${componentPath}'\n`;
            fileSystem.writeFileSync(registryFilePath, importStatement, { flag: 'a' });
        });
    });

    // Create the record structure that holds the component references
    const registryRecord: core.ComponentRegistry = {};
    Object.keys(registry).forEach((strictoType: string) => {
        registryRecord[strictoType] = {};
        Object.keys(registry[strictoType]).forEach((variant: string) => {
            registryRecord[strictoType][variant] = `${strictoType}${variant}`;
        });
    });
    // Write the registry record to the file
    const registryRecordString: string = generate_fronto_components_registry(registryRecord);
    fileSystem.writeFileSync(registryFilePath, registryRecordString, { flag: 'a' });

    // Write the export statement for the registry resolve function
    const exportStatement: string = `\nexport function resolveFrontoComponent(strictoType: string, variant: string): object | undefined {\n    return FRONTO_COMPONENTS_REGISTRY[strictoType]?.[variant];\n}\n`;
    fileSystem.writeFileSync(registryFilePath, exportStatement, { flag: 'a' });
}

function generate_fronto_components_registry(registryRecord: core.ComponentRegistry): string {
    let output: string = `export const FRONTO_COMPONENTS_REGISTRY: Record<StrictoType, Record<FrontoVariant, object>> = {\n`;
    for (const [strictoType, variants] of Object.entries(registryRecord)) {
        output += `  ${strictoType}: {\n`;
        for (const variant of Object.keys(variants)) {
            const componentIdentifier: string = variants[variant];
            output += `    ${variant}: ${componentIdentifier},\n`;
        }
        output += `  },\n`;
    }
    output += `};\n`;
    return output;
}

export { generate_fronto_components_registry };
export { do_scan };
