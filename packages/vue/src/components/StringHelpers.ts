export function normalizeString(value: unknown): string | undefined {
    if (typeof value === 'string') {
        return value
    }
    return undefined
}


export function parseStringInput(value: string): string | undefined {
    return normalizeString(value)
}


export function formatString(value: string): string {
    return value
}
