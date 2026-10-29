import type { FieldTypeTemplate } from './template_types.js'
import { is_valid_base64 } from './template_types.js'

const BYTES_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'Bytes',
    fallbackValue: '',
    normalizeValue(value: unknown): unknown | undefined {
        if (typeof value !== 'string') {
            return undefined
        }

        return is_valid_base64(value) ? value : undefined
    },
}

export { BYTES_TEMPLATE }
