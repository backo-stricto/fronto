import type { FrontoStrictoType } from '@backo-stricto/fronto-core'
import { inferListItemType } from './ListHelpers.js'

export function normalizeDict(value: unknown): Record<string, unknown> | undefined {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return undefined
    }
    return value as Record<string, unknown>
}

export function inferDictValueType(value: unknown): FrontoStrictoType {
    return inferListItemType(value)
}
