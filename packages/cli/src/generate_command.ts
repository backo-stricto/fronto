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
    type InputItemApiRoutes,
    render_input_item_component,
} from './generate_item_templates.js'

const META_URL_SUFFIX = '_meta'
const OPENAPI_URL_SUFFIX = 'openapi'

type OpenApiDocument = {
    paths?: Record<string, Record<string, unknown>>
}

function generate_items_components_from_fir(
    projectPath: string,
    fir: FirModel,
    openApi: OpenApiDocument,
): void {
    const itemsDirectoryPath = path.join(projectPath, core.FRONTO_COMPONENTS_ITEMS_PATH)
    fileSystem.mkdirSync(itemsDirectoryPath, { recursive: true })

    const inputRoutesByCollection = build_input_routes_by_collection(openApi, fir)

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
            const componentSource = render_component_for_variant(
                item,
                variant,
                inputRoutesByCollection[item.collectionName],
            )

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
    inputRoutes: InputItemApiRoutes,
): string {
    if (variant.name === 'display') {
        return render_display_item_component(item)
    }
    return render_input_item_component(item, inputRoutes)
}

function build_input_routes_by_collection(
    openApi: OpenApiDocument,
    fir: FirModel,
): Record<string, InputItemApiRoutes> {
    const routesByCollection: Record<string, InputItemApiRoutes> = {}
    const paths = openApi.paths ?? {}

    for (const item of fir.items) {
        const collectionPath = `/${item.collectionName}`
        const itemPathTemplate = `${collectionPath}/{id}`
        const checkPath = `${collectionPath}/_check`

        const collectionOperations = normalize_path_methods(paths[collectionPath])
        const itemOperations = normalize_path_methods(paths[itemPathTemplate])
        const checkOperations = normalize_path_methods(paths[checkPath])

        routesByCollection[item.collectionName] = {
            collectionPath,
            itemPathTemplate,
            checkPath,
            canCreate: collectionOperations.has('post'),
            canLoad: itemOperations.has('get'),
            canUpdate: itemOperations.has('put'),
            canCheck: checkOperations.has('post'),
        }
    }

    return routesByCollection
}

function normalize_path_methods(pathItem: Record<string, unknown> | undefined): Set<string> {
    if (!pathItem) {
        return new Set<string>()
    }

    const methods = Object.keys(pathItem).map((method) => method.toLowerCase())
    return new Set<string>(methods)
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

    const openapi_json: axios.AxiosResponse<OpenApiDocument> =
        await app_request.get(OPENAPI_URL_SUFFIX)
    const openapi_json_path = path.join(
        projectPath,
        core.FRONTO_COMPONENTS_ITEMS_PATH,
        'openapi.json',
    )
    fileSystem.writeFileSync(openapi_json_path, `${JSON.stringify(openapi_json.data, null, 4)}\n`, {
        encoding: 'utf-8',
    })
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.success()} ${tui.commandInfo('WRITE')} ${pc.inverse(openapi_json_path)}`,
    )

    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.info()} FIR built for app [ ${pc.inverse(fir.source.app)} ] with [ ${pc.inverse(String(fir.items.length))} ] item(s).`,
    )

    generate_items_components_from_fir(projectPath, fir, openapi_json.data)
}

export { do_generate }
