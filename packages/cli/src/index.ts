import { program } from 'commander';
import { do_init } from './init_command.js';
import { do_generate } from './generate_command.js';

program
    .name('fronto')
    .description('Fronto CLI')
    .version('0.1.0');

program.command('init')
    .description('Initialize frontend project with Fronto base components')
    .argument('<path_to_project>', 'Path to the project directory')
    .option('-f, --framework <framework>', 'Base framework to use (vue or react)', 'vue')
    .action((projectPath, options) => {
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

program.parse(process.argv);
