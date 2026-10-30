import type { FrontoComponentProps, FrontoScalarType, FrontoTypeMap } from './domain.js'

export const FRONTO_DEFAULT_PROPS = {
    exist: true,
    readable: true,
    writable: true,
    required: false,
    description: '',
    errorMessage: '',
    defaultValue: undefined,
    value: undefined,
    enum: undefined,
    onChange: undefined,
} satisfies Partial<FrontoComponentProps<unknown>>

export const FRONTO_TYPE_DEFAULTS = {
    Bool: {
        value: true,
        defaultValue: true,
        enum: [true, false],
    },
    Int: {
        value: 0,
        defaultValue: 0,
        enum: undefined,
    },
    Float: {
        value: 0,
        defaultValue: 0,
        enum: undefined,
    },
    String: {
        value: '',
        defaultValue: '',
        enum: undefined,
    },
    Datetime: {
        value: new Date(0).toISOString(),
        defaultValue: new Date(0).toISOString(),
        enum: undefined,
    },
    Bytes: {
        value: '',
        defaultValue: '',
        enum: undefined,
    },
    List: {
        value: [],
        defaultValue: [],
        enum: undefined,
    },
    Dict: {
        value: {},
        defaultValue: {},
        enum: undefined,
    },
    Item: {
        value: {},
        defaultValue: {},
        enum: undefined,
    },
    Ref: {
        value: undefined,
        defaultValue: undefined,
        enum: undefined,
    },
    RefsList: {
        value: [],
        defaultValue: [],
        enum: undefined,
    },
} satisfies Record<keyof FrontoTypeMap, Partial<FrontoComponentProps<unknown>>>

function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function cloneIfMutable<T>(value: T): T {
    if (Array.isArray(value)) {
        return [...value] as T
    }
    if (isRecord(value)) {
        return { ...value } as T
    }
    return value
}

export function resolveFrontoProps<T extends keyof FrontoTypeMap>(
    type: T,
    provided?: Partial<FrontoComponentProps<FrontoTypeMap[T]>>,
): FrontoComponentProps<FrontoTypeMap[T]> {
    const typeDefaults = FRONTO_TYPE_DEFAULTS[type] || {}
    const resolved = {
        ...FRONTO_DEFAULT_PROPS,
        ...typeDefaults,
        ...provided,
    } as FrontoComponentProps<FrontoTypeMap[T]>

    // Keep user-provided references untouched, but avoid sharing mutable defaults across calls.
    if (provided?.value === undefined) {
        resolved.value = cloneIfMutable(resolved.value) as FrontoTypeMap[T]
    }
    if (provided?.defaultValue === undefined) {
        resolved.defaultValue = cloneIfMutable(resolved.defaultValue) as FrontoTypeMap[T]
    }
    if (provided?.enum === undefined && Array.isArray(resolved.enum)) {
        resolved.enum = [...resolved.enum]
    }

    return resolved
}

export function resolveFrontoScalarDefaultValue(
    type: FrontoScalarType,
): FrontoTypeMap[FrontoScalarType] {
    const defaultValue = FRONTO_TYPE_DEFAULTS[type].defaultValue
    if (defaultValue === undefined) {
        throw new Error(`Missing scalar default value for type: ${type}`)
    }
    return defaultValue as FrontoTypeMap[FrontoScalarType]
}
