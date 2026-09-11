import type { FrontoStrictoType } from '@backo-stricto/fronto-core'

export function normalizeList(value: unknown): unknown[] | undefined {
    return Array.isArray(value) ? value : undefined
}

export function inferListItemType(value: unknown): FrontoStrictoType {
    if (Array.isArray(value)) {
        return 'List'
    }
    if (typeof value === 'boolean') {
        return 'Bool'
    }
    if (typeof value === 'number') {
        return Number.isInteger(value) ? 'Int' : 'Float'
    }
    if (typeof value === 'string') {
        if (isDatetimeString(value)) {
            return 'Datetime'
        }
        if (isBase64String(value)) {
            return 'Bytes'
        }
        return 'String'
    }
    return 'Dict'
}

function isDatetimeString(value: string): boolean {
    const date = new Date(value)
    return !Number.isNaN(date.getTime()) && value.includes('T')
}

function isBase64String(value: string): boolean {
    if (value.length === 0 || value.length % 4 !== 0) {
        return false
    }
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
        return false
    }
    try {
        return btoa(atob(value)) === value
    } catch {
        return false
    }
}
