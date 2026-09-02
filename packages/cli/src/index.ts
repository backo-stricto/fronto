import { program } from 'commander';
import { do_install } from './install_command.js';
import { do_generate } from './generate_command.js';
import { do_scan } from './scan_command.js';
import { do_showcase } from './showcase_command.js';
import * as tui from './common.js';

program
    .name('fronto')
    .description('Fronto CLI')
    .version('0.1.0');

program.command('install')
    .description('Initialize frontend project with Fronto base components')
    .argument('<path_to_project>', 'Path to the project directory')
    .option('-f, --framework <framework>', 'Base framework to use (vue or react)', 'vue')
    .action((projectPath: string, options: any) => {
        console.log('Running Fronto CLI for INIT command...');
        if (options.framework !== 'vue') {
            if (options.framework == 'react') {
                console.error(`[INIT] Unsupported base framework: ${options.framework} not yet implemented.`);
            } else {
                console.error(`[INIT] Unsupported base framework: ${options.framework}. Supported frameworks: vue, react`);
            }
            return;
        }
        do_install(projectPath, options.framework);
    });

program.command('generate <url_to_fronto_project>')
    .description('Generate code for a Fronto project')
    .action((url) => {
        do_generate(url);
    });

program.command('scan')
    .description('Scan Fronto components in the current project')
    .argument('<path_to_project>', 'Path to the project directory')
    .action((projectPath: string) => {
        do_scan(projectPath);
    });

program.command('showcase')
    .description('Run the Fronto showcase application')
    .option('-f, --fronto <path_to_fronto_components_in_user_project>', 'Path to the Fronto components directory in the user project')
    .option('-d, --destination  <path_to_showcase_application_in_user_project>', 'Destination path for the showcase application in the user project')
    .action((options: any) => {
        if (!options.fronto) {
            tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.error()} Error: Path to Fronto components is required. Use the -f or --fronto option to specify the path.`);
            return;
        }
        if (!options.destination) {
            tui.finishLine(`${tui.commandInfo('SHOWCASE')} ${tui.error()} Error: Destination path for the showcase application is required. Use the -d or --destination option to specify the path.`);
            return;
        }
        do_showcase(options.fronto, options.destination);
    });
program.parse(process.argv);
