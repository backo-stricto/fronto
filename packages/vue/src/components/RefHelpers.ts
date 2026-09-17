import type { FrontoRefValue } from '@backo-stricto/fronto-core'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeRefId(value: unknown): string | number | undefined {
    if (typeof value === 'string' || typeof value === 'number') {
        return value
    }
    return undefined
}

export function normalizeRef(value: unknown): FrontoRefValue | undefined {
    if (!isObjectRecord(value)) {
        return undefined
    }

    const collection =
        typeof value.collection === 'string'
            ? value.collection
            : typeof value.collectionName === 'string'
              ? value.collectionName
              : undefined

    const id = normalizeRefId(value.id) ?? normalizeRefId(value._id)

    if (!collection || id === undefined) {
        return undefined
    }

    const label = typeof value.label === 'string' ? value.label : undefined

    return {
        ...value,
        collection,
        id,
        ...(label ? { label } : {}),
    }
}

export function formatRef(value: FrontoRefValue | undefined): string {
    if (value === undefined) {
        return '(unlinked)'
    }

    if (typeof value.label === 'string' && value.label.length > 0) {
        return value.label
    }

    return `${value.collection}:${String(value.id)}`
}

export function parseRefInput(value: string): FrontoRefValue | undefined {
    const trimmed = value.trim()
    if (trimmed.length === 0 || trimmed === 'null') {
        return undefined
    }

    try {
        return normalizeRef(JSON.parse(trimmed))
    } catch {
        return undefined
    }
}
