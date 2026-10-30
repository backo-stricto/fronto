import type { FieldTypeTemplate } from './template_types.js'
import { isValidBase64 } from './template_types.js'

const BYTES_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'Bytes',
    normalizeValue(value: unknown): unknown | undefined {
        if (typeof value !== 'string') {
            return undefined
        }

        return isValidBase64(value) ? value : undefined
    },
}

export { BYTES_TEMPLATE }
