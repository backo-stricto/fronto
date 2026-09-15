<script setup lang="ts">
import { ref, watch, ComputedRef } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { useFrontoValue } from '../common.js'
import { inferDictValueType, normalizeDict } from '../DictHelpers.js'
import Bool from './Bool.vue'
import Float from './Float.vue'
import Int from './Int.vue'
import String from './String.vue'
import Datetime from './Datetime.vue'
import Bytes from './Bytes.vue'
import List from './List.vue'

const props = defineProps<FrontoProps<'Dict'>>()

const emit = defineEmits<{
    'update:value': [value: Record<string, unknown>]
}>()

const resolvedValue: ComputedRef<Record<string, unknown> | undefined> = useFrontoValue<'Dict'>(
    props,
    normalizeDict,
)

const inputValue = ref({ ...resolvedValue.value })

watch(resolvedValue, (value) => {
    inputValue.value = { ...value }
})

const leafComponents = {
    Bool,
    Float,
    Int,
    String,
    Datetime,
    Bytes,
    List,
} as const

function componentFor(
    value: unknown,
): (typeof leafComponents)[keyof typeof leafComponents] | 'Dict' | null {
    const type = inferDictValueType(value)
    if (type === 'Dict') {
        return 'Dict'
    }
    if (type in leafComponents) {
        return leafComponents[type as keyof typeof leafComponents]
    }
    return null
}

function valueProps(value: unknown) {
    return {
        value,
        defaultValue: value,
        exist: true,
        readable: true,
        writable: true,
        description: '',
        errorMessage: '',
    }
}

async function updateEntry(key: string | number, value: unknown): Promise<void> {
    const nextValue = { ...inputValue.value, [key]: value }
    inputValue.value = nextValue
    await props.onChange?.(nextValue)
    emit('update:value', nextValue)
}
</script>

<template>
    <InputField
        :exist="props.exist"
        :readable="props.readable"
        :writable="props.writable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default>
            <div class="space-y-2">
                <div
                    v-for="(entryValue, key) in inputValue"
                    :key="key"
                    class="flex items-start gap-2">
                    <span class="min-w-20 pt-2 font-semibold">{{ key }}</span>
                    <component
                        v-if="componentFor(entryValue)"
                        :is="componentFor(entryValue)"
                        v-bind="valueProps(entryValue)"
                        @update:value="updateEntry(key, $event)" />
                    <span v-else>{{ JSON.stringify(entryValue) }}</span>
                </div>
            </div>
        </template>
    </InputField>
</template>
