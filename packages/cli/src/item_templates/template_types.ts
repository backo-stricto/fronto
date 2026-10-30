import type { FrontoScalarType } from '@backo-stricto/fronto-core'

type SupportedFieldType = FrontoScalarType

type FieldTypeTemplate = {
    strictoType: SupportedFieldType
    normalizeValue(value: unknown): unknown | undefined
}

const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

function isValidBase64(value: string): boolean {
    if (!BASE64_PATTERN.test(value)) {
        return false
    }

    try {
        return Buffer.from(Buffer.from(value, 'base64')).toString('base64') === value
    } catch {
        return false
    }
}

export type { FieldTypeTemplate, SupportedFieldType }
export { isValidBase64 }
