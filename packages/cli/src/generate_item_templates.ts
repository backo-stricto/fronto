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
import { get_field_template } from './item_templates/index.js'
import {
    DISPLAY_SCRIPT_BODY_AND_TEMPLATE,
    DISPLAY_SCRIPT_HEAD,
    render_display_constants,
    type DisplayTemplateData,
} from './generate_item_templates_display.js'
import {
    INPUT_SCRIPT_BODY_AND_TEMPLATE,
    INPUT_SCRIPT_HEAD,
    render_input_constants,
    type InputTemplateData,
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

function build_display_field_constants(
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

function build_input_field_constants(
    supportedFields: SupportedFieldRenderModel[],
): InputFieldConstants {
    const displayConstants = build_display_field_constants(supportedFields)
    return {
        ...displayConstants,
        writableByField: Object.fromEntries(
            supportedFields.map((field) => [field.key, field.writable]),
        ),
    }
}

function render_display_item_component(item: FirItem): string {
    const supportedFields = build_supported_fields_model(item.fields)
    const constants: DisplayTemplateData = build_display_field_constants(supportedFields)
    return (
        DISPLAY_SCRIPT_HEAD + render_display_constants(constants) + DISPLAY_SCRIPT_BODY_AND_TEMPLATE
    )
}

function render_input_item_component(item: FirItem, inputApiRoutes: InputItemApiRoutes): string {
    const supportedFields = build_supported_fields_model(item.fields)
    const constants: InputTemplateData = build_input_field_constants(supportedFields)
    return (
        INPUT_SCRIPT_HEAD +
        render_input_constants(constants, inputApiRoutes) +
        INPUT_SCRIPT_BODY_AND_TEMPLATE
    )
}

function build_supported_fields_model(fields: FirField[]): SupportedFieldRenderModel[] {
    const supportedFields: SupportedFieldRenderModel[] = []

    for (const field of fields) {
        const template = get_field_template(field.strictoType)
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

export { render_display_item_component, render_input_item_component }
export type { InputItemApiRoutes }
