import * as path from 'path'
import * as fileSystem from 'fs'
import * as url from 'url'
import * as core from '@backo-stricto/fronto-core'
import * as tui from './common.js'
import pc from 'picocolors'

function do_install(projectPath: string, baseFramework: string): void {
    tui.finishLine(
        `${tui.commandInfo('INSTALL')} ${tui.info()} Initializing project at ${pc.inverse(projectPath)} with basic ${pc.inverse(baseFramework)} Fronto components...`,
    )
    const choosenFramework: string = baseFramework.toLowerCase()
    const packageRoot = path.dirname(
        url.fileURLToPath(
            import.meta.resolve(`@backo-stricto/fronto-${choosenFramework}/package.json`),
        ),
    )
    const sourceComponentsPath = path.join(packageRoot, 'src/components')
    if (!fileSystem.statSync(projectPath, { throwIfNoEntry: false })) {
        fileSystem.mkdirSync(projectPath, { recursive: true })
    }
    const destItemsPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_ITEMS_PATH)
    fileSystem.mkdirSync(destItemsPath, { recursive: true })
    const files: fileSystem.Dirent[] = fileSystem.readdirSync(sourceComponentsPath, {
        withFileTypes: true,
        recursive: true,
    })
    const targetComponentsPath: string = path.join(projectPath, core.FRONTO_COMPONENTS_BASE_PATH)
    fileSystem.mkdirSync(targetComponentsPath, { recursive: true })
    for (const file of files) {
        if (file.isFile()) {
            const componentsCategoryDir: string = file.parentPath.replace(sourceComponentsPath, '')
            const componentTargetPath: string = path.join(
                targetComponentsPath,
                componentsCategoryDir,
                file.name,
            )
            tui.finishLine(
                `${tui.commandInfo('INSTALL')} ${tui.info()} ${tui.commandInfo('COPY')} ${file.name} → ${pc.inverse(componentTargetPath)}`,
            )

            fileSystem.mkdirSync(path.join(targetComponentsPath, componentsCategoryDir), {
                recursive: true,
            })
            fileSystem.copyFileSync(path.join(file.parentPath, file.name), componentTargetPath)
        }
    }
    // Create the base overrides directory and the items overrides directory
    const baseOverridesPath: string = path.join(
        projectPath,
        core.FRONTO_COMPONENTS_OVERRIDES_BASE_PATH,
    )
    core.FrontoVariants.forEach((variant: string) => {
        const variantOverridesPath: string = path.join(baseOverridesPath, variant)
        fileSystem.mkdirSync(variantOverridesPath, { recursive: true })
        tui.finishLine(
            `${tui.commandInfo('INSTALL')} ${tui.success()} ${tui.commandInfo('MKDIR')} ${pc.inverse(variantOverridesPath)}`,
        )
    })
    const itemsOverridesPath: string = path.join(
        projectPath,
        core.FRONTO_COMPONENTS_OVERRIDES_ITEMS_PATH,
    )
    fileSystem.mkdirSync(itemsOverridesPath, { recursive: true })
    tui.finishLine(
        `${tui.commandInfo('INSTALL')} ${tui.success()} ${tui.commandInfo('MKDIR')} ${pc.inverse(itemsOverridesPath)}`,
    )
    tui.finishLine(
        `${tui.commandInfo('INSTALL')} ${tui.success()} Project initialized successfully at ${pc.inverse(
            projectPath,
        )}.`,
    )
}

export { do_install }
