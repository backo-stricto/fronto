import * as path from 'path'
import * as fileSystem from 'fs'
import * as core from '@backo-stricto/fronto-core'
import * as tui from './common.js'
import * as axios from 'axios'
import pc from 'picocolors'
import {
    build_fir_from_meta,
    type BackoMetaSchema,
    type FirModel,
    type FirVariant,
} from './generate_fir.js'
import {
    render_display_item_component,
    render_input_item_component,
} from './generate_item_templates.js'

const META_URL_SUFFIX = '_meta'

function generate_items_components_from_fir(projectPath: string, fir: FirModel): void {
    const itemsDirectoryPath = path.join(projectPath, core.FRONTO_COMPONENTS_ITEMS_PATH)
    fileSystem.mkdirSync(itemsDirectoryPath, { recursive: true })

    const firFilePath = path.join(itemsDirectoryPath, 'fronto.fir.json')
    fileSystem.writeFileSync(firFilePath, `${JSON.stringify(fir, null, 4)}\n`, {
        encoding: 'utf-8',
    })
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.success()} ${tui.commandInfo('WRITE')} ${pc.inverse(firFilePath)}`,
    )

    for (const item of fir.items) {
        for (const variant of item.variants) {
            const outputPath = path.join(projectPath, variant.targetPath)
            const componentSource = render_component_for_variant(item, variant)

            fileSystem.writeFileSync(outputPath, componentSource, { encoding: 'utf-8' })
            tui.finishLine(
                `${tui.commandInfo('GENERATE')} ${tui.success()} ${tui.commandInfo('WRITE')} ${pc.inverse(outputPath)}`,
            )
        }
    }
}

function render_component_for_variant(
    item: FirModel['items'][number],
    variant: FirVariant,
): string {
    if (variant.name === 'display') {
        return render_display_item_component(item)
    }
    return render_input_item_component(item)
}

async function do_generate(projectPath: string, url: string, name: string): Promise<void> {
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} application-specific components in [ ${pc.inverse(projectPath)} ]`,
    )
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.info()} URL to Fronto project: [ ${pc.inverse(url)} ]`,
    )

    const app_request: axios.AxiosInstance = axios.create({
        baseURL: `${url}/${name}`,
        timeout: 5000,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })

    const meta_json: axios.AxiosResponse<BackoMetaSchema> = await app_request.get(META_URL_SUFFIX)
    const fir = build_fir_from_meta(meta_json.data)

    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.info()} FIR built for app [ ${pc.inverse(fir.source.app)} ] with [ ${pc.inverse(String(fir.items.length))} ] item(s).`,
    )

    generate_items_components_from_fir(projectPath, fir)
}

export { do_generate }
