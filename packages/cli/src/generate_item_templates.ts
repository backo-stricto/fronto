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

type InputItemApiRoutes = {
    collectionPath: string
    itemPathTemplate: string
    checkPath: string
    canCreate: boolean
    canLoad: boolean
    canUpdate: boolean
    canCheck: boolean
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

function render_input_item_component(item: FirItem, inputApiRoutes: InputItemApiRoutes): string {
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
import { computed, ref, watch } from 'vue'
import { resolveFrontoProps, type FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../base/InputField.vue'
import Bool from '../base/input/Bool.vue'

type InputMode = 'auto' | 'create' | 'edit'
type ResolvedMode = 'create' | 'edit'

type ItemInputProps = FrontoProps<'Item'> & {
    mode?: InputMode
    id?: string | null
    apiBaseUrl?: string
    autoLoad?: boolean
    checkBeforeApply?: boolean
}

type ApplyEventPayload = {
    mode: ResolvedMode
    value: Record<string, unknown>
}

// Mode resolution matrix:
// - mode=create + no id     => create
// - mode=create + valid id  => warn and coerce to edit
// - mode=edit   + valid id  => edit
// - mode=edit   + missing id => error
// - mode=auto   + valid id  => edit
// - mode=auto   + no id     => create
// - any invalid id          => error

const props = defineProps<ItemInputProps>()

const emit = defineEmits<{
    'update:value': [value: Record<string, unknown>]
    applied: [payload: ApplyEventPayload]
    cancel: [value: Record<string, unknown>]
    warning: [message: string]
    error: [message: string]
}>()

const FIELD_ORDER = ${JSON.stringify(fieldOrder, null, 4)}
const FIELD_DEFAULTS: Record<string, boolean> = ${JSON.stringify(defaultValues, null, 4)}
const FIELD_LABELS: Record<string, string> = ${JSON.stringify(labels, null, 4)}
const FIELD_WRITABLE: Record<string, boolean> = ${JSON.stringify(writableByField, null, 4)}
const INPUT_API_ROUTES: {
    collectionPath: string
    itemPathTemplate: string
    checkPath: string
    canCreate: boolean
    canLoad: boolean
    canUpdate: boolean
    canCheck: boolean
} = ${JSON.stringify(inputApiRoutes, null, 4)}

type InputState = Record<string, boolean>
type IdResolution =
    | { kind: 'missing' }
    | { kind: 'valid'; id: string }
    | { kind: 'invalid'; reason: string }

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
const committedValue = ref<InputState>({ ...draftValue.value })
const resolvedMode = ref<ResolvedMode>('create')
const resolvedId = ref<string | null>(null)
const modeResolutionError = ref<string>('')
const operationError = ref<string>('')
const isLoading = ref(false)
const isApplying = ref(false)

watch(
    () => props.value,
    (nextValue) => {
        const normalizedValue = createInitialDraft(nextValue as Record<string, unknown> | undefined)
        draftValue.value = normalizedValue
        committedValue.value = { ...normalizedValue }
    },
)

watch(
    () => [props.mode, props.id, props.autoLoad] as const,
    async () => {
        const modeIsValid = synchronizeModeState()
        if (!modeIsValid) {
            return
        }
        await maybeLoadFromApi()
    },
    { immediate: true },
)

const shouldRunServerCheck = computed(() => props.checkBeforeApply !== false)
const combinedErrorMessage = computed(() => {
    if (modeResolutionError.value.length > 0) {
        return modeResolutionError.value
    }
    if (operationError.value.length > 0) {
        return operationError.value
    }
    return props.errorMessage ?? ''
})
const isBusy = computed(() => isLoading.value || isApplying.value)

function resolveId(idValue: unknown): IdResolution {
    if (idValue === undefined || idValue === null) {
        return { kind: 'missing' }
    }
    if (typeof idValue !== 'string') {
        return { kind: 'invalid', reason: 'id must be a string.' }
    }

    const trimmed = idValue.trim()
    if (trimmed.length === 0) {
        return { kind: 'invalid', reason: 'id must be a non-empty string.' }
    }

    return { kind: 'valid', id: trimmed }
}

function synchronizeModeState(): boolean {
    const requestedMode = props.mode ?? 'auto'
    const idResolution = resolveId(props.id)
    if (idResolution.kind === 'invalid') {
        modeResolutionError.value = 'Invalid id: ' + idResolution.reason
        resolvedId.value = null
        operationError.value = ''
        emit('error', modeResolutionError.value)
        return false
    }

    if (requestedMode === 'edit') {
        if (idResolution.kind !== 'valid') {
            modeResolutionError.value = 'Mode "edit" requires a valid id.'
            resolvedId.value = null
            operationError.value = ''
            emit('error', modeResolutionError.value)
            return false
        }

        resolvedMode.value = 'edit'
        resolvedId.value = idResolution.id
        modeResolutionError.value = ''
        operationError.value = ''
        return true
    }

    if (requestedMode === 'create') {
        if (idResolution.kind === 'valid') {
            const warningMessage =
                'Mode "create" received a valid id. For safety, mode is coerced to "edit".'
            resolvedMode.value = 'edit'
            resolvedId.value = idResolution.id
            modeResolutionError.value = ''
            operationError.value = ''
            emit('warning', warningMessage)
            console.warn(warningMessage)
            return true
        }

        resolvedMode.value = 'create'
        resolvedId.value = null
        modeResolutionError.value = ''
        operationError.value = ''
        return true
    }

    if (idResolution.kind === 'valid') {
        resolvedMode.value = 'edit'
        resolvedId.value = idResolution.id
    } else {
        resolvedMode.value = 'create'
        resolvedId.value = null
    }
    modeResolutionError.value = ''
    operationError.value = ''
    return true
}

function trimTrailingSlash(baseUrl: string): string {
    if (baseUrl.endsWith('/')) {
        return baseUrl.slice(0, -1)
    }
    return baseUrl
}

function buildRequestUrl(pathname: string): string {
    const baseUrl = (props.apiBaseUrl ?? '').trim()
    if (baseUrl.length === 0) {
        return pathname
    }
    return trimTrailingSlash(baseUrl) + pathname
}

function resolveItemPath(id: string): string {
    return INPUT_API_ROUTES.itemPathTemplate.replace('{id}', encodeURIComponent(id))
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>
    }
    return undefined
}

async function requestJson(
    method: 'GET' | 'POST' | 'PUT',
    pathname: string,
    payload?: Record<string, unknown>,
): Promise<unknown> {
    const response = await fetch(buildRequestUrl(pathname), {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : undefined,
    })

    const rawBody = await response.text()
    if (!response.ok) {
        throw new Error(rawBody || String(response.status) + ' ' + response.statusText)
    }

    if (rawBody.trim().length === 0) {
        return undefined
    }

    return JSON.parse(rawBody) as unknown
}

function applySnapshot(value: Record<string, unknown> | undefined): void {
    const snapshot = createInitialDraft(value)
    draftValue.value = snapshot
    committedValue.value = { ...snapshot }
    emit('update:value', { ...snapshot })
}

async function maybeLoadFromApi(): Promise<void> {
    if (props.autoLoad === false) {
        return
    }
    if (resolvedMode.value !== 'edit' || resolvedId.value === null) {
        return
    }
    if (!INPUT_API_ROUTES.canLoad) {
        operationError.value =
            'Cannot load item: missing GET route for ' + INPUT_API_ROUTES.itemPathTemplate + '.'
        emit('error', operationError.value)
        return
    }

    isLoading.value = true
    operationError.value = ''

    try {
        const response = await requestJson('GET', resolveItemPath(resolvedId.value))
        applySnapshot(asRecord(response))
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load item.'
        operationError.value = 'Load failed: ' + message
        emit('error', operationError.value)
    } finally {
        isLoading.value = false
    }
}

async function runServerCheck(payload: Record<string, unknown>): Promise<void> {
    if (!INPUT_API_ROUTES.canCheck) {
        throw new Error(
            'Check is enabled but route ' + INPUT_API_ROUTES.checkPath + ' is unavailable.',
        )
    }

    const response = await requestJson('POST', INPUT_API_ROUTES.checkPath, payload)
    const checkResult = asRecord(response)
    const errorMessage = checkResult?.error
    if (typeof errorMessage === 'string' && errorMessage.trim().length > 0) {
        throw new Error(errorMessage.trim())
    }
}

function resolveWritable(fieldKey: string, disabled: boolean): boolean {
    return FIELD_WRITABLE[fieldKey] && !disabled && !isBusy.value
}

function updateField(fieldKey: string, nextValue: unknown): void {
    if (isBusy.value) {
        return
    }

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
        writable: resolveWritable(fieldKey, disabled),
    })
}

async function onApply(): Promise<void> {
    if (!synchronizeModeState()) {
        return
    }
    if (props.writable === false) {
        operationError.value = 'Apply is not allowed: component is not writable.'
        emit('error', operationError.value)
        return
    }

    const payload: Record<string, unknown> = { ...draftValue.value }
    isApplying.value = true
    operationError.value = ''

    try {
        if (shouldRunServerCheck.value) {
            await runServerCheck(payload)
        }

        let persisted: unknown
        if (resolvedMode.value === 'create') {
            if (!INPUT_API_ROUTES.canCreate) {
                throw new Error(
                    'Cannot create item: missing POST route for ' +
                        INPUT_API_ROUTES.collectionPath +
                        '.',
                )
            }
            persisted = await requestJson('POST', INPUT_API_ROUTES.collectionPath, payload)
        } else {
            if (!INPUT_API_ROUTES.canUpdate) {
                throw new Error(
                    'Cannot update item: missing PUT route for ' +
                        INPUT_API_ROUTES.itemPathTemplate +
                        '.',
                )
            }
            if (!resolvedId.value) {
                throw new Error('Cannot update item: no valid id resolved.')
            }
            persisted = await requestJson('PUT', resolveItemPath(resolvedId.value), payload)
        }

        const persistedRecord = asRecord(persisted)
        if (persistedRecord) {
            applySnapshot(persistedRecord)
            emit('applied', { mode: resolvedMode.value, value: persistedRecord })
        } else {
            committedValue.value = { ...draftValue.value }
            emit('applied', { mode: resolvedMode.value, value: { ...draftValue.value } })
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to apply changes.'
        operationError.value = 'Apply failed: ' + message
        emit('error', operationError.value)
    } finally {
        isApplying.value = false
    }
}

function onCancel(): void {
    draftValue.value = { ...committedValue.value }
    emit('update:value', { ...draftValue.value })
    emit('cancel', { ...draftValue.value })
}
</script>

<template>
    <InputField
        :exist="props.exist"
        :readable="props.readable"
        :writable="props.writable"
        :description="props.description"
        :error-message="combinedErrorMessage">
        <template #default="{ disabled }">
            <form
                class="space-y-3"
                @submit.prevent="onApply">
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
                <div class="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm"
                        :disabled="disabled || isBusy"
                        @click="onCancel">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary btn-sm"
                        :disabled="disabled || isBusy || modeResolutionError.length > 0">
                        Apply
                    </button>
                </div>
            </form>
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
export type { InputItemApiRoutes }
