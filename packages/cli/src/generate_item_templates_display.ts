import type { SupportedFieldType } from './item_templates/index.js'

type DisplayTemplateData = {
    fieldOrder: string[]
    defaultValues: Record<string, unknown>
    labels: Record<string, string>
    fieldTypes: Record<string, SupportedFieldType>
}

const DISPLAY_SCRIPT_HEAD = `<script setup lang="ts">
import { resolveFrontoProps, type FrontoProps } from '@backo-stricto/fronto-core'
import { resolveFrontoComponent } from '../registry'
import DisplayField from '../base/DisplayField.vue'

type SupportedFieldType = 'Bool' | 'Int' | 'Float' | 'String' | 'Datetime' | 'Bytes'

const props = defineProps<FrontoProps<'Item'>>()

`

const DISPLAY_SCRIPT_BODY_AND_TEMPLATE = `function normalizeDatetime(value: unknown): string | undefined {
    if (typeof value !== 'string' && !(value instanceof Date)) {
        return undefined
    }

    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
        return undefined
    }

    return date.toISOString()
}

const BASE64_PATTERN =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

function normalizeBytes(value: unknown): string | undefined {
    if (typeof value !== 'string' || !BASE64_PATTERN.test(value)) {
        return undefined
    }

    try {
        return btoa(atob(value)) === value ? value : undefined
    } catch {
        return undefined
    }
}

function normalizeFieldValue(fieldType: SupportedFieldType, value: unknown): unknown | undefined {
    if (fieldType === 'Bool') {
        return typeof value === 'boolean' ? value : undefined
    }
    if (fieldType === 'Int') {
        return typeof value === 'number' && Number.isInteger(value) ? value : undefined
    }
    if (fieldType === 'Float') {
        return typeof value === 'number' && Number.isFinite(value) ? value : undefined
    }
    if (fieldType === 'String') {
        return typeof value === 'string' ? value : undefined
    }
    if (fieldType === 'Datetime') {
        return normalizeDatetime(value)
    }
    return normalizeBytes(value)
}

function resolveFieldType(fieldKey: string): SupportedFieldType {
    return FIELD_TYPES[fieldKey] ?? 'String'
}

function resolveFieldValue(fieldKey: string): unknown {
    const fieldType = resolveFieldType(fieldKey)
    const incomingValue = (props.value as Record<string, unknown> | undefined)?.[fieldKey]
    const normalizedIncoming = normalizeFieldValue(fieldType, incomingValue)
    if (normalizedIncoming !== undefined) {
        return normalizedIncoming
    }

    const normalizedDefault = normalizeFieldValue(fieldType, FIELD_DEFAULTS[fieldKey])
    if (normalizedDefault !== undefined) {
        return normalizedDefault
    }

    return FIELD_DEFAULTS[fieldKey]
}

function resolveFieldProps(fieldKey: string) {
    const fieldType = resolveFieldType(fieldKey)
    return resolveFrontoProps(fieldType, {
        value: resolveFieldValue(fieldKey),
        defaultValue: FIELD_DEFAULTS[fieldKey],
        writable: false,
    })
}

function resolveDisplayComponent(fieldKey: string): unknown {
    return resolveFrontoComponent(resolveFieldType(fieldKey), 'display')
}
</script>

<template>
    <DisplayField
        variant="display"
        :exist="props.exist"
        :readable="props.readable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default>
            <div class="space-y-2">
                <div
                    v-for="fieldKey in FIELD_ORDER"
                    :key="fieldKey"
                    class="flex items-center gap-3">
                    <span class="min-w-40 font-semibold">{{ FIELD_LABELS[fieldKey] }}</span>
                    <component
                        :is="resolveDisplayComponent(fieldKey)"
                        v-bind="resolveFieldProps(fieldKey)" />
                </div>
            </div>
        </template>
    </DisplayField>
</template>
`

function render_display_constants(data: DisplayTemplateData): string {
    return `const FIELD_ORDER = ${JSON.stringify(data.fieldOrder, null, 4)}
const FIELD_DEFAULTS: Record<string, unknown> = ${JSON.stringify(data.defaultValues, null, 4)}
const FIELD_LABELS: Record<string, string> = ${JSON.stringify(data.labels, null, 4)}
const FIELD_TYPES: Record<string, SupportedFieldType> = ${JSON.stringify(data.fieldTypes, null, 4)}

`
}

export {
    DISPLAY_SCRIPT_BODY_AND_TEMPLATE,
    DISPLAY_SCRIPT_HEAD,
    render_display_constants,
}
export type { DisplayTemplateData }
