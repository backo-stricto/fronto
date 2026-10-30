export const FRONTO_VARIANTS = ['display', 'input', 'cell'] as const

// Backward-compatible alias.
export const FrontoVariants = FRONTO_VARIANTS

export type FrontoComponentVariant = (typeof FRONTO_VARIANTS)[number]

export const FRONTO_STRICTO_TYPES = [
    'Bool',
    'Int',
    'Float',
    'String',
    'Datetime',
    'Bytes',
    'List',
    'Dict',
    'Item',
    'Ref',
    'RefsList',
] as const

// Backward-compatible alias.
export const StrictoTypes = FRONTO_STRICTO_TYPES

export type FrontoStrictoType = (typeof FRONTO_STRICTO_TYPES)[number]

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
    defaultValue?: boolean
}

export interface FrontoIntField extends FrontoFieldBase {
    strictoType: 'Int'
    min?: number
    max?: number
    defaultValue?: number
}

export interface FrontoFloatField extends FrontoFieldBase {
    strictoType: 'Float'
    min?: number
    max?: number
    defaultValue?: number
}

export interface FrontoStringField extends FrontoFieldBase {
    strictoType: 'String'
    patterns?: string[]
    enumValues?: string[]
    defaultValue?: string
}

export interface FrontoDatetimeField extends FrontoFieldBase {
    strictoType: 'Datetime'
    defaultValue?: string
}

export interface FrontoBytesField extends FrontoFieldBase {
    strictoType: 'Bytes'
    defaultValue?: string
}

export interface FrontoListField extends FrontoFieldBase {
    strictoType: 'List'
    itemType: FrontoFieldDefinition
    defaultValue?: unknown[]
}

export interface FrontoDictField extends FrontoFieldBase {
    strictoType: 'Dict'
    fields: Record<string, FrontoFieldDefinition>
}

export interface FrontoItemField extends FrontoFieldBase {
    strictoType: 'Item'
    fields: Record<string, FrontoItemPropertyDefinition>
    defaultValue?: Record<string, unknown>
}

export interface FrontoRefValue {
    collection: string
    id: string | number
    label?: string
    [key: string]: unknown
}

export interface FrontoRefField extends FrontoFieldBase {
    strictoType: 'Ref'
    refType: string
    defaultValue?: FrontoRefValue | null
}

export interface FrontoRefsListField extends FrontoFieldBase {
    strictoType: 'RefsList'
    itemType: FrontoRefField
    defaultValue?: FrontoRefValue[]
}

export type FrontoFieldDefinition =
    | FrontoBoolField
    | FrontoIntField
    | FrontoFloatField
    | FrontoStringField
    | FrontoDatetimeField
    | FrontoBytesField
    | FrontoListField
    | FrontoDictField
    | FrontoItemField
    | FrontoRefField
    | FrontoRefsListField

/** Item properties may not contain another Item definition. */
export type FrontoItemPropertyDefinition = Exclude<FrontoFieldDefinition, FrontoItemField>

export interface FrontoFieldState<TValue> {
    value: TValue
    validationMessages: FrontoValidationMessage[]
}

export interface FrontoComponentSource {
    strictoType: FrontoStrictoType
    variant: FrontoComponentVariant
    sourcePath: string
}

export type ComponentRegistry = Record<string, Record<string, string>>

export type FrontoTypeMap = {
    Bool: boolean
    Int: number
    Float: number
    String: string
    Datetime: string
    Bytes: string
    List: unknown[]
    Dict: Record<string, unknown>
    Item: Record<string, unknown>
    Ref: FrontoRefValue | null
    RefsList: FrontoRefValue[]
}

export type FrontoScalarType = 'Bool' | 'Int' | 'Float' | 'String' | 'Datetime' | 'Bytes'

export interface FrontoComponentProps<TValue = unknown> {
    exist?: boolean
    readable?: boolean
    writable?: boolean
    required?: boolean
    description?: string
    errorMessage?: string
    defaultValue: TValue
    value?: TValue
    enum?: TValue[]
    onChange?: (value: TValue) => void
}

export type FrontoProps<T extends keyof FrontoTypeMap> = FrontoComponentProps<FrontoTypeMap[T]>
