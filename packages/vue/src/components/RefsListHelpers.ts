import type { FrontoRefValue } from '@backo-stricto/fronto-core'
import { normalizeRef } from './RefHelpers.js'

export function normalizeRefsList(value: unknown): FrontoRefValue[] | undefined {
    if (!Array.isArray(value)) {
        return undefined
    }

    const refs: FrontoRefValue[] = []

    for (const item of value) {
        const normalizedRef = normalizeRef(item)
        if (normalizedRef === undefined) {
            return undefined
        }
        if (normalizedRef !== null) {
            refs.push(normalizedRef)
        }
    }

    return refs
}

export function parseRefsListInput(value: string): FrontoRefValue[] | undefined {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
        return []
    }

    try {
        return normalizeRefsList(JSON.parse(trimmed))
    } catch {
        return undefined
    }
}
