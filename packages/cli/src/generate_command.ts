import * as path from 'path'
import * as fileSystem from 'fs'
import * as url from 'url'
import * as core from '@backo-stricto/fronto-core'
import * as tui from './common.js'
import * as axios from 'axios'
import pc from 'picocolors'

const META_URL_SUFFIX = '_meta'

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

    const meta_json: axios.AxiosResponse = await app_request.get(META_URL_SUFFIX)

    console.log('Meta JSON:', meta_json.data) // Log the meta JSON to the console

    // Add logic to generate code for a Fronto project
}

export { do_generate }
