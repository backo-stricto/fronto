/**
 * Render Vue SFC source strings for generated Item components.
 *
 * Scope:
 * - Bool item fields only (first implementation)
 * - display and input templates
 */
import type { FirField, FirItem } from './generate_fir.js'

type BoolFieldRenderModel = {
    key: string
    label: string
    defaultValue: boolean
    writable: boolean
}

function render_display_item_component(item: FirItem): string {
    const boolFields = build_bool_fields_model(item.fields)
    const fieldOrder = boolFields.map((field) => field.key)
    const defaultValues = Object.fromEntries(
        boolFields.map((field) => [field.key, field.defaultValue]),
    )
    const labels = Object.fromEntries(boolFields.map((field) => [field.key, field.label]))

    return `<script setup lang="ts">
import { resolveFrontoProps, type FrontoProps } from '@backo-stricto/fronto-core'
import DisplayField from '../base/DisplayField.vue'
import Bool from '../base/display/Bool.vue'

const props = defineProps<FrontoProps<'Item'>>()

const FIELD_ORDER = ${JSON.stringify(fieldOrder, null, 4)}
const FIELD_DEFAULTS: Record<string, boolean> = ${JSON.stringify(defaultValues, null, 4)}
const FIELD_LABELS: Record<string, string> = ${JSON.stringify(labels, null, 4)}

function resolveFieldValue(key: string): boolean {
    const incomingValue = (props.value as Record<string, unknown> | undefined)?.[key]
    if (typeof incomingValue === 'boolean') {
        return incomingValue
    }
    return FIELD_DEFAULTS[key] ?? false
}

function resolveBoolProps(key: string) {
    return resolveFrontoProps('Bool', {
        value: resolveFieldValue(key),
        defaultValue: FIELD_DEFAULTS[key],
        writable: false,
    })
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
                    <Bool v-bind="resolveBoolProps(fieldKey)" />
                </div>
            </div>
        </template>
    </DisplayField>
</template>
`
}

function render_input_item_component(item: FirItem): string {
    const boolFields = build_bool_fields_model(item.fields)
    const fieldOrder = boolFields.map((field) => field.key)
    const defaultValues = Object.fromEntries(
        boolFields.map((field) => [field.key, field.defaultValue]),
    )
    const labels = Object.fromEntries(boolFields.map((field) => [field.key, field.label]))
    const writableByField = Object.fromEntries(
        boolFields.map((field) => [field.key, field.writable]),
    )

    return `<script setup lang="ts">
import { ref, watch } from 'vue'
import { resolveFrontoProps, type FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../base/InputField.vue'
import Bool from '../base/input/Bool.vue'

const props = defineProps<FrontoProps<'Item'>>()

const emit = defineEmits<{
    'update:value': [value: Record<string, unknown>]
}>()

const FIELD_ORDER = ${JSON.stringify(fieldOrder, null, 4)}
const FIELD_DEFAULTS: Record<string, boolean> = ${JSON.stringify(defaultValues, null, 4)}
const FIELD_LABELS: Record<string, string> = ${JSON.stringify(labels, null, 4)}
const FIELD_WRITABLE: Record<string, boolean> = ${JSON.stringify(writableByField, null, 4)}

type InputState = Record<string, boolean>

function resolveInitialBooleanValue(fieldKey: string, incoming: Record<string, unknown> | undefined): boolean {
    const incomingValue = incoming?.[fieldKey]
    if (typeof incomingValue === 'boolean') {
        return incomingValue
    }

    const schemaDefault = FIELD_DEFAULTS[fieldKey]
    if (typeof schemaDefault === 'boolean') {
        return schemaDefault
    }

    return false
}

function createInitialDraft(incoming: Record<string, unknown> | undefined): InputState {
    const draft: InputState = {}
    for (const fieldKey of FIELD_ORDER) {
        draft[fieldKey] = resolveInitialBooleanValue(fieldKey, incoming)
    }
    return draft
}

const draftValue = ref<InputState>(createInitialDraft(props.value as Record<string, unknown> | undefined))

watch(
    () => props.value,
    (nextValue) => {
        draftValue.value = createInitialDraft(nextValue as Record<string, unknown> | undefined)
    },
)

function updateField(fieldKey: string, nextValue: unknown): void {
    const boolValue = nextValue === true
    draftValue.value = {
        ...draftValue.value,
        [fieldKey]: boolValue,
    }
    emit('update:value', { ...draftValue.value })
}

function resolveBoolProps(fieldKey: string, disabled: boolean) {
    return resolveFrontoProps('Bool', {
        value: draftValue.value[fieldKey],
        defaultValue: FIELD_DEFAULTS[fieldKey],
        writable: FIELD_WRITABLE[fieldKey] && !disabled,
    })
}
</script>

<template>
    <InputField
        :exist="props.exist"
        :readable="props.readable"
        :writable="props.writable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default="{ disabled }">
            <div class="space-y-2">
                <div
                    v-for="fieldKey in FIELD_ORDER"
                    :key="fieldKey"
                    class="flex items-center gap-3">
                    <span class="min-w-40 font-semibold">{{ FIELD_LABELS[fieldKey] }}</span>
                    <Bool
                        v-bind="resolveBoolProps(fieldKey, disabled)"
                        @update:value="updateField(fieldKey, $event)" />
                </div>
            </div>
        </template>
    </InputField>
</template>
`
}

function build_bool_fields_model(fields: FirField[]): BoolFieldRenderModel[] {
    return fields
        .filter((field) => field.strictoType === 'Bool')
        .map((field) => ({
            key: field.key,
            label: field.label,
            defaultValue: field.defaultValue === true,
            writable: field.writable,
        }))
}

export { render_display_item_component, render_input_item_component }
