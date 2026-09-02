import pc from 'picocolors';

export const STATUS_CHARS = {
    SUCCESS: '✓',
    ERROR: '✗',
    WARNING: '⚠',
    INFO: 'ℹ'
}

export function replaceLine(text: string) {
    process.stdout.write('\r\x1b[K' + text);
}

export function finishLine(text: string) {
    replaceLine(text);
    process.stdout.write('\n');
}

export function success(): string {
    return pc.green('[SUCCESS]');
}

export function warn(): string {
    return pc.yellow('[WARN]');
}

export function error(): string {
    return pc.red('[ERROR]');
}

export function info(): string {
    return pc.blue('[INFO]');
}

export function commandInfo(command: string): string {
    return pc.bold(pc.cyanBright(`[${command}]`));
}

export function successMark(): string {
    return pc.bold(pc.green(STATUS_CHARS.SUCCESS));
}

export function errorMark(): string {
    return pc.bold(pc.red(STATUS_CHARS.ERROR));
}

export function warnMark(): string {
    return pc.bold(pc.yellow(STATUS_CHARS.WARNING));
}

export function infoMark(): string {
    return pc.bold(pc.blue(STATUS_CHARS.INFO));
}
