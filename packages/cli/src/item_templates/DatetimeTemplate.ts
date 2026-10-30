import type { FieldTypeTemplate } from './template_types.js'

function normalizeDatetime(value: unknown): string | undefined {
    if (typeof value !== 'string' && !(value instanceof Date)) {
        return undefined
    }

    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
        return undefined
    }

    return date.toISOString()
}

const DATETIME_TEMPLATE: FieldTypeTemplate = {
    strictoType: 'Datetime',
    normalizeValue(value: unknown): unknown | undefined {
        return normalizeDatetime(value)
    },
}

export { DATETIME_TEMPLATE }
