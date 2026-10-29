import type { FieldTypeTemplate } from './template_types.js'

const STRING_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'String',
    fallbackValue: '',
    normalizeValue(value: unknown): unknown | undefined {
        return typeof value === 'string' ? value : undefined
    },
}

export { STRING_TEMPLATE }
