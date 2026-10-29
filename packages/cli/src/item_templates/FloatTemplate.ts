import type { FieldTypeTemplate } from './template_types.js'

const FLOAT_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'Float',
    normalizeValue(value: unknown): unknown | undefined {
        return typeof value === 'number' && Number.isFinite(value) ? value : undefined
    },
}

export { FLOAT_TEMPLATE }
