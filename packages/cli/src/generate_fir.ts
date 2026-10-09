/**
 * Build a small Fronto Intermediate Representation (FIR) model from Backo _meta payload.
 *
 * Scope:
 * - Item collections only
 * - display + input variants only
 * - technical fields (keys starting with "_") are skipped
 */
import * as path from 'path'
import * as core from '@backo-stricto/fronto-core'

type BackoRights = {
    read?: boolean | null
    modify?: boolean | null
}

type BackoFieldSchema = {
    types?: string[]
    description?: string | null
    required?: boolean | null
    default?: unknown
    rights?: BackoRights | null
    path?: string
    sub_scheme?: Record<string, BackoFieldSchema>
}

type BackoCollectionSchema = {
    name: string
    item?: BackoFieldSchema
    rights?: BackoRights
}

type BackoMetaSchema = {
    name: string
    collections?: BackoCollectionSchema[]
}

type FirInitialValueSource = 'incoming' | 'schemaDefault' | 'typeFallback'

type FirField = {
    key: string
    label: string
    strictoType: string
    required: boolean
    defaultValue: unknown
    writable: boolean
}

type FirVariantName = 'display' | 'input'

type FirVariant = {
    name: FirVariantName
    componentName: string
    targetPath: string
    fieldKeys: string[]
}

type FirItem = {
    collectionName: string
    componentNameBase: string
    fields: FirField[]
    variants: FirVariant[]
}

type FirModel = {
    firVersion: string
    source: {
        app: string
    }
    rules: {
        inputInitialValueOrder: FirInitialValueSource[]
        writableFormula: string
    }
    items: FirItem[]
}

const FIR_VERSION = '0.2'
const INPUT_INITIAL_VALUE_ORDER: FirInitialValueSource[] = [
    'incoming',
    'schemaDefault',
    'typeFallback',
]
const WRITABLE_FORMULA = 'collection.modify && field.modify !== false'

function build_fir_from_meta(meta: BackoMetaSchema): FirModel {
    const collections = meta.collections ?? []

    const items: FirItem[] = collections
        .map((collection) => {
            const itemSchema = collection.item
            if (!itemSchema || !itemSchema.sub_scheme || !is_item_schema(itemSchema)) {
                return undefined
            }

            const collectionWritable = collection.rights?.modify === true
            const fields: FirField[] = Object.entries(itemSchema.sub_scheme)
                .filter(([key]) => !is_technical_field(key))
                .map(([key, fieldSchema]) => {
                    const strictoType = resolve_stricto_type(fieldSchema.types)
                    const fieldModify = fieldSchema.rights?.modify
                    const writable = collectionWritable && fieldModify !== false

                    return {
                        key,
                        label: humanize_key(key),
                        strictoType,
                        required: fieldSchema.required === true,
                        defaultValue: fieldSchema.default ?? null,
                        writable,
                    }
                })

            if (fields.length === 0) {
                return undefined
            }

            const componentNameBase = `${to_pascal_case(collection.name)}Item`
            const fieldKeys = fields.map((field) => field.key)

            const variants: FirVariant[] = [
                {
                    name: 'display',
                    componentName: `${componentNameBase}Display`,
                    targetPath: path.join(
                        core.FRONTO_COMPONENTS_ITEMS_PATH,
                        `${componentNameBase}Display.vue`,
                    ),
                    fieldKeys,
                },
                {
                    name: 'input',
                    componentName: `${componentNameBase}Input`,
                    targetPath: path.join(
                        core.FRONTO_COMPONENTS_ITEMS_PATH,
                        `${componentNameBase}Input.vue`,
                    ),
                    fieldKeys,
                },
            ]

            return {
                collectionName: collection.name,
                componentNameBase,
                fields,
                variants,
            }
        })
        .filter((item): item is FirItem => item !== undefined)

    return {
        firVersion: FIR_VERSION,
        source: {
            app: meta.name,
        },
        rules: {
            inputInitialValueOrder: INPUT_INITIAL_VALUE_ORDER,
            writableFormula: WRITABLE_FORMULA,
        },
        items,
    }
}

function is_item_schema(fieldSchema: BackoFieldSchema): boolean {
    return (fieldSchema.types ?? []).includes('Item')
}

function is_technical_field(key: string): boolean {
    return key.startsWith('_')
}

function resolve_stricto_type(types: string[] | undefined): string {
    if (!types || types.length === 0) {
        return 'Unknown'
    }

    const ignoredTypes = new Set(['GenericType', 'Extend'])
    const resolvedType = types.find((typeName) => !ignoredTypes.has(typeName))
    return resolvedType ?? 'Unknown'
}

function to_pascal_case(value: string): string {
    return value
        .split(/[^a-zA-Z0-9]/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join('')
}

function humanize_key(key: string): string {
    return key
        .split('_')
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ')
}

export type {
    BackoMetaSchema,
    FirField,
    FirInitialValueSource,
    FirItem,
    FirModel,
    FirVariant,
    FirVariantName,
}
export { build_fir_from_meta }
