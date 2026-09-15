import type { FrontoStrictoType } from '@backo-stricto/fronto-core'
import { inferDictValueType, normalizeDict } from './DictHelpers.js'

export function normalizeItem(value: unknown): Record<string, unknown> | undefined {
    return normalizeDict(value)
}

export function inferItemValueType(value: unknown): FrontoStrictoType {
    return inferDictValueType(value)
}
