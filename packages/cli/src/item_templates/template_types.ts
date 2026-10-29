type SupportedFieldType = 'Bool' | 'Int' | 'Float' | 'String' | 'Datetime' | 'Bytes'

type FieldTypeTemplate = {
    strictoType: SupportedFieldType
    normalizeValue(value: unknown): unknown | undefined
}

const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

function is_valid_base64(value: string): boolean {
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
export { is_valid_base64 }
