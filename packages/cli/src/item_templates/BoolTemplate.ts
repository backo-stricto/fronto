import type { FieldTypeTemplate } from './template_types.js'

const BOOL_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'Bool',
    fallbackValue: false,
    normalizeValue(value: unknown): unknown | undefined {
        return typeof value === 'boolean' ? value : undefined
    },
}

export { BOOL_TEMPLATE }
