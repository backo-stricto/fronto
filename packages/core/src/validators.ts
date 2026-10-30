import type { FrontoTypeMap } from './domain.js'

export function normalizeDatetimeToUtcIso(
    value: string | Date | null | undefined,
): string | null | undefined {
    if (value === undefined || value === null) {
        return value
    }

    const parsedDate = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid datetime value: ${String(value)}`)
    }

    return parsedDate.toISOString()
}

export function isBase64(value: string): boolean {
    if (value.length === 0) {
        return true
    }
    if (value.length % 4 !== 0) {
        return false
    }
    return /^[A-Za-z0-9+/]*={0,2}$/.test(value)
}

function areEnumValuesEqual(left: unknown, right: unknown): boolean {
    if (left instanceof Date && right instanceof Date) {
        return left.getTime() === right.getTime()
    }
    return left === right
}

export function isValueInEnum<T extends keyof FrontoTypeMap>(
    value: FrontoTypeMap[T],
    enumValues: FrontoTypeMap[T][] | undefined,
): boolean {
    if (enumValues === undefined) {
        return true
    }
    if (enumValues.length === 0) {
        return false
    }
    return enumValues.some((enumValue) => areEnumValuesEqual(value, enumValue))
}
