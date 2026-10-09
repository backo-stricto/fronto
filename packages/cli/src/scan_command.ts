import * as path from 'path'
import * as fileSystem from 'fs'
import * as core from '@backo-stricto/fronto-core'
import * as tui from './common.js'
import pc from 'picocolors'

type ScannedItemVariant = 'display' | 'input'

type ScannedItemComponent = {
    itemName: string
    variant: ScannedItemVariant
    fileName: string
}

function do_scan(projectPath: string): void {
    const projectBaseComponentsPath: string = path.join(
        projectPath,
        core.FRONTO_COMPONENTS_BASE_PATH,
    )

    tui.finishLine(
        `${tui.commandInfo('SCAN')} Scanning Fronto components in project [ ${pc.inverse(projectPath)} ]`,
    )

    const baseComponentsRegistry: core.ComponentRegistry = {}

    core.StrictoTypes.forEach((strictoType: string) => {
        baseComponentsRegistry[strictoType] = {}
        const missing: string[] = []
        const overrides: string[] = []

        core.FrontoVariants.forEach((variant: string) => {
            const componentFilePath: string = path.join(
                projectBaseComponentsPath,
                variant,
                `${strictoType}.vue`,
            )

            tui.replaceLine(
                `${tui.commandInfo('SCAN')} Components scanning for [ ${pc.inverse(strictoType)} / ${pc.inverse(variant)} ]`,
            )

            if (fileSystem.existsSync(componentFilePath)) {
                baseComponentsRegistry[strictoType][variant] ??=
                    `./base/${variant}/${strictoType}.vue`

                const overrideComponentFilePath: string = path.join(
                    projectPath,
                    core.FRONTO_COMPONENTS_OVERRIDES_BASE_PATH,
                    variant,
                    `${strictoType}.vue`,
                )

                if (fileSystem.existsSync(overrideComponentFilePath)) {
                    overrides.push(`${overrideComponentFilePath}`)
                    baseComponentsRegistry[strictoType][variant] =
                        `./overrides/base/${variant}/${strictoType}.vue`
                }
            } else {
                missing.push(`${componentFilePath}`)
            }
        })

        if (missing.length === 0) {
            tui.finishLine(
                `${tui.commandInfo('SCAN')} Components scanning for [ ${pc.inverse(strictoType)} ] [ ${pc.green('DONE')} ] [ ${pc.green('COMPLETE')} ]`,
            )
        } else {
            tui.finishLine(
                `${tui.commandInfo('SCAN')} Components scanning for [ ${pc.inverse(strictoType)} ] [ ${pc.green('DONE')} ] [ ${pc.yellow(`MISSING COMPONENTS`)} ]`,
            )
            missing.forEach((missingFile: string) => {
                tui.finishLine(`\t${tui.errorMark()} ${missingFile}`)
            })
        }
        if (overrides.length > 0) {
            tui.info()
            tui.finishLine(
                `${tui.commandInfo('SCAN')} ${tui.info()} Found override component files for ${strictoType}:`,
            )
            overrides.forEach((overrideFile: string) => {
                tui.finishLine(`${tui.infoMark()} ${overrideFile}`)
            })
        }
    })

    generate_base_registry_file(projectPath, baseComponentsRegistry)

    const itemsComponentsRegistry = build_items_components_registry(projectPath)
    generate_items_registry_file(projectPath, itemsComponentsRegistry)

    tui.finishLine(
        `${tui.commandInfo('SCAN')} ${tui.success()} Generated registry files: ${pc.inverse('fronto/components/registry.ts')} and ${pc.inverse('fronto/components/registry.items.ts')}`,
    )
}

function generate_base_registry_file(projectPath: string, registry: core.ComponentRegistry): void {
    const registryFilePath: string = path.join(
        projectPath,
        core.FRONTO_COMPONENTS_ROOT_PATH,
        'registry.ts',
    )

    generate_registry_file({
        registryFilePath,
        registry,
        registryName: 'FRONTO_COMPONENTS_REGISTRY',
        registryType: 'Record<StrictoType, Record<FrontoVariant, object>>',
        resolverName: 'resolveFrontoComponent',
        resolverKeyName: 'strictoType',
    })
}

function generate_items_registry_file(projectPath: string, registry: core.ComponentRegistry): void {
    const registryFilePath: string = path.join(
        projectPath,
        core.FRONTO_COMPONENTS_ROOT_PATH,
        'registry.items.ts',
    )

    generate_registry_file({
        registryFilePath,
        registry,
        registryName: 'FRONTO_ITEMS_COMPONENTS_REGISTRY',
        registryType: 'Record<string, Record<string, object>>',
        resolverName: 'resolveFrontoItemComponent',
        resolverKeyName: 'itemName',
    })
}

function build_items_components_registry(projectPath: string): core.ComponentRegistry {
    const registry: core.ComponentRegistry = {}
    const itemsPath = path.join(projectPath, core.FRONTO_COMPONENTS_ITEMS_PATH)
    const itemsOverridesPath = path.join(projectPath, core.FRONTO_COMPONENTS_OVERRIDES_ITEMS_PATH)

    const vanillaFiles = list_vue_files(itemsPath)
    const overrideFiles = list_vue_files(itemsOverridesPath)

    const vanillaMap = new Map<string, ScannedItemComponent>()
    const overrideMap = new Map<string, ScannedItemComponent>()

    vanillaFiles.forEach((fileName) => {
        const parsedComponent = parse_item_component(fileName)
        if (!parsedComponent) {
            return
        }
        vanillaMap.set(`${parsedComponent.itemName}:${parsedComponent.variant}`, parsedComponent)
    })

    overrideFiles.forEach((fileName) => {
        const parsedComponent = parse_item_component(fileName)
        if (!parsedComponent) {
            return
        }
        overrideMap.set(`${parsedComponent.itemName}:${parsedComponent.variant}`, parsedComponent)
    })

    for (const [key, component] of vanillaMap.entries()) {
        registry[component.itemName] ??= {}
        registry[component.itemName][component.variant] = `./items/${component.fileName}`

        const overrideComponent = overrideMap.get(key)
        if (overrideComponent) {
            registry[component.itemName][component.variant] =
                `./overrides/items/${overrideComponent.fileName}`
        }
    }

    for (const [key, component] of overrideMap.entries()) {
        if (vanillaMap.has(key)) {
            continue
        }

        registry[component.itemName] ??= {}
        registry[component.itemName][component.variant] = `./overrides/items/${component.fileName}`
    }

    tui.finishLine(
        `${tui.commandInfo('SCAN')} ${tui.info()} Items components discovered: ${pc.inverse(String(Object.keys(registry).length))}`,
    )

    return registry
}

function parse_item_component(fileName: string): ScannedItemComponent | undefined {
    if (!fileName.endsWith('.vue')) {
        return undefined
    }

    const componentName = fileName.slice(0, -'.vue'.length)
    if (componentName.endsWith('Display')) {
        return {
            itemName: componentName.slice(0, -'Display'.length),
            variant: 'display',
            fileName,
        }
    }

    if (componentName.endsWith('Input')) {
        return {
            itemName: componentName.slice(0, -'Input'.length),
            variant: 'input',
            fileName,
        }
    }

    return undefined
}

function list_vue_files(directoryPath: string): string[] {
    if (!fileSystem.existsSync(directoryPath)) {
        return []
    }

    return fileSystem
        .readdirSync(directoryPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.vue'))
        .map((entry) => entry.name)
}

type GenerateRegistryFileParams = {
    registryFilePath: string
    registry: core.ComponentRegistry
    registryName: string
    registryType: string
    resolverName: string
    resolverKeyName: string
}

function generate_registry_file(params: GenerateRegistryFileParams): void {
    const {
        registryFilePath,
        registry,
        registryName,
        registryType,
        resolverName,
        resolverKeyName,
    } = params

    fileSystem.writeFileSync(registryFilePath, `${core.FRONTO_GENERATED_CODE_NOTICE}\n\n`, {
        encoding: 'utf-8',
    })

    const importIdentifiersByPath = new Map<string, string>()
    const usedIdentifiers = new Set<string>()
    const registryRecord: core.ComponentRegistry = {}

    const sortedOuterKeys = Object.keys(registry).sort((a, b) => a.localeCompare(b))
    for (const outerKey of sortedOuterKeys) {
        registryRecord[outerKey] = {}

        const sortedVariants = Object.keys(registry[outerKey]).sort((a, b) => a.localeCompare(b))
        for (const variant of sortedVariants) {
            const componentPath = registry[outerKey][variant]
            let importIdentifier = importIdentifiersByPath.get(componentPath)
            if (!importIdentifier) {
                importIdentifier = to_unique_identifier(`${outerKey}_${variant}`, usedIdentifiers)
                importIdentifiersByPath.set(componentPath, importIdentifier)
            }

            registryRecord[outerKey][variant] = importIdentifier
        }
    }

    for (const [componentPath, identifier] of importIdentifiersByPath.entries()) {
        fileSystem.writeFileSync(
            registryFilePath,
            `import ${identifier} from '${componentPath}'\n`,
            { flag: 'a', encoding: 'utf-8' },
        )
    }

    fileSystem.writeFileSync(registryFilePath, '\n', { flag: 'a', encoding: 'utf-8' })

    const registryRecordString = generate_components_registry_literal(
        registryRecord,
        registryName,
        registryType,
    )
    fileSystem.writeFileSync(registryFilePath, registryRecordString, {
        flag: 'a',
        encoding: 'utf-8',
    })

    const exportStatement = `\nexport function ${resolverName}(${resolverKeyName}: string, variant: string): object | undefined {\n    return ${registryName}[${resolverKeyName}]?.[variant];\n}\n`
    fileSystem.writeFileSync(registryFilePath, exportStatement, { flag: 'a', encoding: 'utf-8' })
}

function to_unique_identifier(seed: string, usedIdentifiers: Set<string>): string {
    const normalizedSeed = seed.replace(/[^A-Za-z0-9_]/g, '_')
    const firstIdentifier = /^[A-Za-z_]/.test(normalizedSeed)
        ? normalizedSeed
        : `_${normalizedSeed}`

    let candidate = firstIdentifier
    let suffix = 1
    while (usedIdentifiers.has(candidate)) {
        candidate = `${firstIdentifier}_${suffix}`
        suffix += 1
    }

    usedIdentifiers.add(candidate)
    return candidate
}

function generate_components_registry_literal(
    registryRecord: core.ComponentRegistry,
    registryName: string,
    registryType: string,
): string {
    let output: string = `export const ${registryName}: ${registryType} = {\n`

    for (const [outerKey, variants] of Object.entries(registryRecord)) {
        output += `  ${outerKey}: {\n`
        for (const variant of Object.keys(variants)) {
            const componentIdentifier: string = variants[variant]
            output += `    ${variant}: ${componentIdentifier},\n`
        }
        output += `  },\n`
    }

    output += `};\n`
    return output
}

function generate_fronto_components_registry(registryRecord: core.ComponentRegistry): string {
    return generate_components_registry_literal(
        registryRecord,
        'FRONTO_COMPONENTS_REGISTRY',
        'Record<StrictoType, Record<FrontoVariant, object>>',
    )
}

export { generate_fronto_components_registry }
export { do_scan }
