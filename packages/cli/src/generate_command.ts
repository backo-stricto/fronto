import * as path from 'path'
import * as fileSystem from 'fs'
import * as core from '@backo-stricto/fronto-core'
import * as tui from './common.js'
import * as axios from 'axios'
import pc from 'picocolors'
import {
    buildFirFromMeta,
    type BackoMetaSchema,
    type FirModel,
    type FirVariant,
} from './generate_fir.js'
import {
    renderDisplayItemComponent,
    type InputItemApiRoutes,
    renderInputItemComponent,
} from './generate_item_templates.js'

const META_URL_SUFFIX = '_meta'
const OPENAPI_URL_SUFFIX = '_openapi'

type GenerateOptions = {
    backendUrl: string
    proxyUrl?: string
    proxyApiPrefix: string
    name: string
}

type OpenApiDocument = {
    paths?: Record<string, Record<string, unknown>>
}

function trimTrailingSlash(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url
}

function trimSurroundingSlashes(pathPart: string): string {
    return pathPart.replace(/^\/+|\/+$/g, '')
}

function joinAppBaseUrl(baseUrl: string, appName: string): string {
    const normalizedBase = trimTrailingSlash(baseUrl)
    const normalizedAppName = trimSurroundingSlashes(appName)
    return `${normalizedBase}/${normalizedAppName}`
}

function joinProxyAppBaseUrl(baseUrl: string, proxyApiPrefix: string, appName: string): string {
    const normalizedBase = trimTrailingSlash(baseUrl)
    const normalizedPrefix = trimSurroundingSlashes(proxyApiPrefix)
    const normalizedAppName = trimSurroundingSlashes(appName)

    if (normalizedPrefix.length === 0) {
        return `${normalizedBase}/${normalizedAppName}`
    }

    return `${normalizedBase}/${normalizedPrefix}/${normalizedAppName}`
}

function resolveClientBaseUrl(options: GenerateOptions): string {
    if (options.proxyUrl && options.proxyUrl.trim().length > 0) {
        return joinProxyAppBaseUrl(options.proxyUrl, options.proxyApiPrefix, options.name)
    }
    return joinAppBaseUrl(options.backendUrl, options.name)
}

function resolveBackendBaseUrl(options: GenerateOptions): string {
    return joinAppBaseUrl(options.backendUrl, options.name)
}

function normalizeGenerateOptions(options: GenerateOptions): GenerateOptions {
    return {
        backendUrl: trimTrailingSlash(options.backendUrl.trim()),
        proxyUrl:
            options.proxyUrl && options.proxyUrl.trim().length > 0
                ? trimTrailingSlash(options.proxyUrl.trim())
                : undefined,
        proxyApiPrefix: trimSurroundingSlashes(options.proxyApiPrefix.trim()),
        name: trimSurroundingSlashes(options.name.trim()),
    }
}

function validateGenerateOptions(options: GenerateOptions): void {
    if (options.backendUrl.length === 0) {
        throw new Error('backend-url is required and cannot be empty.')
    }
    if (options.name.length === 0) {
        throw new Error('name is required and cannot be empty.')
    }
}

function logGenerateUrls(backendBaseUrl: string, clientBaseUrl: string): void {
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.info()} Backend URL (metadata/openapi): [ ${pc.inverse(backendBaseUrl)} ]`,
    )
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.info()} Client URL (generated input requests): [ ${pc.inverse(clientBaseUrl)} ]`,
    )
}

function generateItemsComponentsFromFir(
    projectPath: string,
    fir: FirModel,
    openApi: OpenApiDocument,
    appBaseUrl: string,
): void {
    const itemsDirectoryPath = path.join(projectPath, core.FRONTO_COMPONENTS_ITEMS_PATH)
    fileSystem.mkdirSync(itemsDirectoryPath, { recursive: true })

    const inputRoutesByCollection = buildInputRoutesByCollection(openApi, fir, appBaseUrl)

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
            const componentSource = renderComponentForVariant(
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

function renderComponentForVariant(
    item: FirModel['items'][number],
    variant: FirVariant,
    inputRoutes: InputItemApiRoutes,
): string {
    if (variant.name === 'display') {
        return renderDisplayItemComponent(item)
    }
    return renderInputItemComponent(item, inputRoutes)
}

function buildInputRoutesByCollection(
    openApi: OpenApiDocument,
    fir: FirModel,
    appBaseUrl: string,
): Record<string, InputItemApiRoutes> {
    const routesByCollection: Record<string, InputItemApiRoutes> = {}
    const paths = openApi.paths ?? {}

    for (const item of fir.items) {
        const collectionPath = `/${item.collectionName}`
        const itemPathTemplate = `${collectionPath}/{id}`
        const checkPath = `${collectionPath}/_check`

        const collectionOperations = normalizePathMethods(paths[collectionPath])
        const itemOperations = normalizePathMethods(paths[itemPathTemplate])
        const checkOperations = normalizePathMethods(paths[checkPath])

        routesByCollection[item.collectionName] = {
            defaultApiBaseUrl: appBaseUrl,
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

function normalizePathMethods(pathItem: Record<string, unknown> | undefined): Set<string> {
    if (!pathItem) {
        return new Set<string>()
    }

    const methods = Object.keys(pathItem).map((method) => method.toLowerCase())
    return new Set<string>(methods)
}

async function doGenerate(projectPath: string, options: GenerateOptions): Promise<void> {
    const normalizedOptions = normalizeGenerateOptions(options)
    validateGenerateOptions(normalizedOptions)

    const backendBaseUrl = resolveBackendBaseUrl(normalizedOptions)
    const clientBaseUrl = resolveClientBaseUrl(normalizedOptions)

    tui.finishLine(
        `${tui.commandInfo('GENERATE')} application-specific components in [ ${pc.inverse(projectPath)} ]`,
    )
    tui.finishLine(
        `${tui.commandInfo('GENERATE')} ${tui.info()} Backend root URL: [ ${pc.inverse(normalizedOptions.backendUrl)} ]`,
    )
    logGenerateUrls(backendBaseUrl, clientBaseUrl)

    const app_request: axios.AxiosInstance = axios.create({
        baseURL: backendBaseUrl,
        timeout: 5000,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })

    const meta_json: axios.AxiosResponse<BackoMetaSchema> = await app_request.get(META_URL_SUFFIX)
    const fir = buildFirFromMeta(meta_json.data)

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

    generateItemsComponentsFromFir(projectPath, fir, openapi_json.data, clientBaseUrl)
}

export { doGenerate }
