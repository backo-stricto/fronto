/**
 * Render Vue SFC source strings for generated Item components.
 *
 * Scope:
 * - Item fields of types: Bool, Int, Float, String, Datetime, Bytes
 * - display and input templates
 */
import type { FirField, FirItem } from './generate_fir.js'
import { resolveFrontoScalarDefaultValue } from '@backo-stricto/fronto-core'
import type { SupportedFieldType } from './item_templates/index.js'
import { getFieldTemplate as getFieldTemplate } from './item_templates/index.js'
import {
    DISPLAY_SCRIPT_BODY_AND_TEMPLATE,
    DISPLAY_SCRIPT_HEAD,
    renderDisplayConstants,
    type DisplayTemplateModel,
} from './generate_item_templates_display.js'
import {
    INPUT_SCRIPT_BODY_AND_TEMPLATE,
    INPUT_SCRIPT_HEAD,
    renderInputConstants,
    type InputTemplateModel,
} from './generate_item_templates_input.js'

type SupportedFieldRenderModel = {
    key: string
    label: string
    writable: boolean
    strictoType: SupportedFieldType
    defaultValue: unknown
}

type InputItemApiRoutes = {
    defaultApiBaseUrl: string
    collectionPath: string
    itemPathTemplate: string
    checkPath: string
    canCreate: boolean
    canLoad: boolean
    canUpdate: boolean
    canCheck: boolean
}

type DisplayFieldConstants = {
    fieldOrder: string[]
    defaultValues: Record<string, unknown>
    labels: Record<string, string>
    fieldTypes: Record<string, SupportedFieldType>
}

type InputFieldConstants = DisplayFieldConstants & {
    writableByField: Record<string, boolean>
}

function buildDisplayFieldConstants(
    supportedFields: SupportedFieldRenderModel[],
): DisplayFieldConstants {
    return {
        fieldOrder: supportedFields.map((field) => field.key),
        defaultValues: Object.fromEntries(
            supportedFields.map((field) => [field.key, field.defaultValue]),
        ),
        labels: Object.fromEntries(supportedFields.map((field) => [field.key, field.label])),
        fieldTypes: Object.fromEntries(
            supportedFields.map((field) => [field.key, field.strictoType]),
        ) as Record<string, SupportedFieldType>,
    }
}

function buildInputFieldConstants(
    supportedFields: SupportedFieldRenderModel[],
): InputFieldConstants {
    const displayConstants = buildDisplayFieldConstants(supportedFields)
    return {
        ...displayConstants,
        writableByField: Object.fromEntries(
            supportedFields.map((field) => [field.key, field.writable]),
        ),
    }
}

function renderDisplayItemComponent(item: FirItem): string {
    const supportedFields = buildSupportedFieldsModel(item.fields)
    const constants: DisplayTemplateModel = buildDisplayFieldConstants(supportedFields)
    return (
        DISPLAY_SCRIPT_HEAD + renderDisplayConstants(constants) + DISPLAY_SCRIPT_BODY_AND_TEMPLATE
    )
}

function renderInputItemComponent(item: FirItem, inputApiRoutes: InputItemApiRoutes): string {
    const supportedFields = buildSupportedFieldsModel(item.fields)
    const constants: InputTemplateModel = buildInputFieldConstants(supportedFields)
    return (
        INPUT_SCRIPT_HEAD +
        renderInputConstants(constants, inputApiRoutes) +
        INPUT_SCRIPT_BODY_AND_TEMPLATE
    )
}

function buildSupportedFieldsModel(fields: FirField[]): SupportedFieldRenderModel[] {
    const supportedFields: SupportedFieldRenderModel[] = []

    for (const field of fields) {
        const template = getFieldTemplate(field.strictoType)
        if (!template) {
            continue
        }

        const normalizedDefaultValue = template.normalizeValue(field.defaultValue)
        supportedFields.push({
            key: field.key,
            label: field.label,
            writable: field.writable,
            strictoType: template.strictoType,
            defaultValue:
                normalizedDefaultValue !== undefined
                    ? normalizedDefaultValue
                    : resolveFrontoScalarDefaultValue(template.strictoType),
        })
    }

    return supportedFields
}

export { renderDisplayItemComponent, renderInputItemComponent }
export type { InputItemApiRoutes }
