export type FrontoComponentVariant = 'display' | 'input' | 'cell'

export type FrontoStrictoType =
    | 'Bool'
    | 'Int'
    | 'Float'
    | 'String'
    | 'Datetime'
    | 'Bytes'
    | 'Dict'

export interface FrontoValidationMessage {
    path: string
    message: string
    code?: string
}

export interface FrontoFieldBase {
    strictoType: FrontoStrictoType
    label?: string
    description?: string
    required?: boolean
    readOnly?: boolean
}

export interface FrontoBoolField extends FrontoFieldBase {
    strictoType: 'Bool'
    defaultValue?: boolean | null
}

export interface FrontoIntField extends FrontoFieldBase {
    strictoType: 'Int'
    min?: number
    max?: number
    defaultValue?: number | null
}

export interface FrontoFloatField extends FrontoFieldBase {
    strictoType: 'Float'
    min?: number
    max?: number
    defaultValue?: number | null
}

export interface FrontoStringField extends FrontoFieldBase {
    strictoType: 'String'
    patterns?: string[]
    enumValues?: string[]
    defaultValue?: string | null
}

export interface FrontoDatetimeField extends FrontoFieldBase {
    strictoType: 'Datetime'
    defaultValue?: string | null
}

export interface FrontoBytesField extends FrontoFieldBase {
    strictoType: 'Bytes'
    defaultValue?: string | null
}

export interface FrontoDictField extends FrontoFieldBase {
    strictoType: 'Dict'
    fields: Record<string, FrontoFieldDefinition>
}

export type FrontoFieldDefinition =
    | FrontoBoolField
    | FrontoIntField
    | FrontoFloatField
    | FrontoStringField
    | FrontoDatetimeField
    | FrontoBytesField
    | FrontoDictField

export interface FrontoFieldState<TValue> {
    value: TValue
    validationMessages: FrontoValidationMessage[]
}

export interface FrontoComponentSource {
    strictoType: FrontoStrictoType
    variant: FrontoComponentVariant
    sourcePath: string
}

export function normalizeDatetimeToUtcIso(
    value: string | Date | null | undefined,
): string | null | undefined {
    if (value === undefined || value === null) {
        return value
    }

    const parsedDate = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid datetime value: ${String(value)}`)
    }

    return parsedDate.toISOString()
}

export function isBase64(value: string): boolean {
    const normalized = value.trim()
    if (normalized.length === 0 || normalized.length % 4 !== 0) {
        return false
    }

    return /^[A-Za-z0-9+/]*={0,2}$/.test(normalized)
}
