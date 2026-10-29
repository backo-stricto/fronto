import type { FieldTypeTemplate } from './template_types.js'

const INT_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'Int',
    normalizeValue(value: unknown): unknown | undefined {
        return typeof value === 'number' && Number.isInteger(value) ? value : undefined
    },
}

export { INT_TEMPLATE }
