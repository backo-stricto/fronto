export function normalizeInt(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isInteger(value)) {
        return value
    }
    return undefined
}


export function parseIntInput(value: string): number | undefined {
    const normalizedValue = value.trim()
    if (!/^[+-]?\d+$/.test(normalizedValue)) {
        return undefined
    }
    return normalizeInt(Number(normalizedValue))
}


export function formatInt(value: number): string {
    return String(value)
}
