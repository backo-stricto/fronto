import { program } from 'commander'
import { do_install } from './install_command.js'
import { do_scan } from './scan_command.js'
import { do_generate } from './generate_command.js'
import { do_showcase } from './showcase_command.js'
import * as tui from './common.js'

type InstallOptions = {
    framework: string
}

type ShowcaseOptions = {
    fronto?: string
    destination?: string
}

program.name('fronto').description('Fronto CLI').version('0.1.0')

program
    .command('install')
    .description('Initialize frontend project with Fronto base components')
    .argument('<path_to_project>', 'Path to the project directory')
    .option('-f, --framework <framework>', 'Base framework to use (vue or react)', 'vue')
    .action((projectPath: string, options: InstallOptions) => {
        if (options.framework !== 'vue') {
            if (options.framework == 'react') {
                tui.finishLine(
                    `${tui.commandInfo('INSTALL')} ${tui.error()} Error: Unsupported base framework: ${options.framework} not yet implemented.`,
                )
            } else {
                tui.finishLine(
                    `${tui.commandInfo('INSTALL')} ${tui.error()} Error: Unsupported base framework: ${options.framework}. Supported frameworks: vue, react`,
                )
            }
            return
        }
        do_install(projectPath, options.framework)
    })

program
    .command('generate')
    .description(
        'Generate code for a Fronto project from the running Backend API living at the specified URL',
    )
    .argument('<path_to_project>', 'Path to the project directory')
    .option(
        '-u, --url <url_to_backend_api_server>',
        'URL to the running Backend API for the Fronto project',
        'http://localhost:5000',
    )
    .option(
        '-n, --name <internal_name_of_backend_api_server>',
        'Internal name of the Backend API server',
        'default',
    )
    .action((projectPath: string, options: { url: string; name: string }) => {
        do_generate(projectPath, options.url, options.name)
            .then(() => {
                tui.finishLine(
                    `${tui.commandInfo('GENERATE')} ${tui.success()} Code generation completed successfully.`,
                )
            })
            .catch((error: Error) => {
                tui.finishLine(
                    `${tui.commandInfo('GENERATE')} ${tui.error()} Error during code generation: ${error.message}`,
                )
            })
    })

program
    .command('scan')
    .description('Scan Fronto components in the current project')
    .argument('<path_to_project>', 'Path to the project directory')
    .action((projectPath: string) => {
        do_scan(projectPath)
    })

program
    .command('showcase')
    .description('Run the Fronto showcase application')
    .option(
        '-f, --fronto <path_to_fronto_components_in_user_project>',
        'Path to the Fronto components directory in the user project',
    )
    .option(
        '-d, --destination  <path_to_showcase_application_in_user_project>',
        'Destination path for the showcase application in the user project',
    )
    .action((options: ShowcaseOptions) => {
        if (!options.fronto) {
            tui.finishLine(
                `${tui.commandInfo('SHOWCASE')} ${tui.error()} Error: Path to Fronto components is required. Use the -f or --fronto option to specify the path.`,
            )
            return
        }
        if (!options.destination) {
            tui.finishLine(
                `${tui.commandInfo('SHOWCASE')} ${tui.error()} Error: Destination path for the showcase application is required. Use the -d or --destination option to specify the path.`,
            )
            return
        }
        do_showcase(options.fronto, options.destination)
    })
program.parse(process.argv)
