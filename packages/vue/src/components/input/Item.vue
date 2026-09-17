<script setup lang="ts">
import { ref, watch, type Component, type ComputedRef } from 'vue'
import type { FrontoComponentProps, FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { isCompoundFrontoType, resolveNestedFrontoProps, useFrontoValue } from '../common.js'
import { inferItemValueType, normalizeItem } from '../ItemHelpers.js'
import Bool from './Bool.vue'
import Bytes from './Bytes.vue'
import Datetime from './Datetime.vue'
import Dict from './Dict.vue'
import Float from './Float.vue'
import Int from './Int.vue'
import List from './List.vue'
import Ref from './Ref.vue'
import RefsList from './RefsList.vue'
import String from './String.vue'

const props = defineProps<FrontoProps<'Item'>>()

const emit = defineEmits<{
    'update:value': [value: Record<string, unknown>]
}>()

const resolvedValue: ComputedRef<Record<string, unknown> | undefined> = useFrontoValue<'Item'>(
    props,
    normalizeItem,
)
const inputValue = ref({ ...resolvedValue.value })

watch(resolvedValue, (value) => {
    inputValue.value = { ...value }
})

const scalarComponents = { Bool, Float, Int, String, Datetime, Bytes, Ref } as const
const compoundComponents = { List, Dict, RefsList } as const

function componentFor(value: unknown): Component | null {
    const type = inferItemValueType(value)
    if (isCompoundFrontoType(type)) {
        return compoundComponents[type]
    }
    return type in scalarComponents ? scalarComponents[type as keyof typeof scalarComponents] : null
}

function valueProps(value: unknown): FrontoComponentProps<unknown> {
    const type = inferItemValueType(value)
    return resolveNestedFrontoProps(type, value, {
        writable: true,
    }) as FrontoComponentProps<unknown>
}

async function updateEntry(key: string | number, value: unknown): Promise<void> {
    const nextValue = { ...inputValue.value, [key]: value }
    inputValue.value = nextValue
}

async function submitItem(): Promise<void> {
    const nextValue = { ...inputValue.value }
    await props.onChange?.(nextValue)
    emit('update:value', nextValue)
}

function cancelChanges(): void {
    inputValue.value = { ...resolvedValue.value }
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
            <form
                class="space-y-2"
                @submit.prevent="submitItem">
                <div
                    v-for="(entryValue, key) in inputValue"
                    :key="key"
                    class="flex items-start gap-2">
                    <label class="min-w-20 pt-2 font-semibold">{{ key }}</label>
                    <component
                        v-if="componentFor(entryValue)"
                        :is="componentFor(entryValue)"
                        v-bind="valueProps(entryValue)"
                        :disabled="disabled"
                        @update:value="updateEntry(key, $event)" />
                    <span v-else>{{ JSON.stringify(entryValue) }}</span>
                </div>
                <div class="flex gap-2 pt-2">
                    <button
                        type="button"
                        class="btn btn-ghost"
                        :disabled="disabled"
                        @click="cancelChanges">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="disabled">
                        Send
                    </button>
                </div>
            </form>
        </template>
    </InputField>
</template>
