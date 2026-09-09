export function normalizeFloat(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value
    }
    return undefined
}

export function parseFloatInput(value: string): number | undefined {
    const normalizedValue = value.trim()
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalizedValue)) {
        return undefined
    }
    return normalizeFloat(Number(normalizedValue))
}

export function formatFloat(value: number): string {
    return String(value)
}
