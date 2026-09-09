export function normalizeBool(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') {
        return value
    }
    return undefined
}

export function formatBool(value: boolean): string {
    if (value === true) {
        return 'true'
    }
    return 'false'
}
