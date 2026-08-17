import { program } from 'commander';
import { do_init } from './init_command.js';
import { do_generate } from './generate_command.js';
import { do_scan } from './scan_command.js';
import { do_showcase } from './showcase_command.js';

program
    .name('fronto')
    .description('Fronto CLI')
    .version('0.1.0');

program.command('init')
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
        do_init(projectPath, options.framework);
    });

program.command('generate <url_to_fronto_project>')
    .description('Generate code for a Fronto project')
    .action((url) => {
        console.log('Running Fronto CLI for GENERATE command...');
        do_generate(url);
    });

program.command('scan')
    .description('Scan Fronto components in the current project')
    .argument('<path_to_project>', 'Path to the project directory')
    .action((projectPath: string) => {
        console.log('Running Fronto CLI for SCAN command...');
        do_scan(projectPath);
    });

program.command('showcase')
    .description('Run the Fronto showcase application')
    .option('-f, --fronto <path_to_fronto_components_in_user_project>', 'Path to the Fronto components directory in the user project')
    .option('-d, --destination  <path_to_showcase_application_in_user_project>', 'Destination path for the showcase application in the user project')
    .action((options: any) => {
        if (!options.fronto) {
            console.error('[SHOWCASE] Error: Path to Fronto components is required. Use the -f or --fronto option to specify the path.');
            return;
        }
        if (!options.destination) {
            console.error('[SHOWCASE] Error: Destination path for the showcase application is required. Use the -d or --destination option to specify the path.');
            return;
        }
        console.log(`[SHOWCASE] Fronto components path: ${options.fronto}`);
        console.log('Running Fronto CLI for SHOWCASE command...');
        console.log(`[SHOWCASE] Project root: ${options.destination}`);
        do_showcase(options.fronto, options.destination);
    });
program.parse(process.argv);
