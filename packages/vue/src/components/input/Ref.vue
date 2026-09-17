<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { normalizeRef, parseRefInput } from '../RefHelpers.js'
import { useLooseFrontoValue } from '../common.js'

const props = defineProps<FrontoProps<'Ref'>>()
const emit = defineEmits<{ 'update:value': [value: FrontoProps<'Ref'>['value']] }>()

const resolvedValue = useLooseFrontoValue<'Ref'>(props, normalizeRef)
const inputValue = ref(resolvedValue.value ? JSON.stringify(resolvedValue.value, null, 2) : '')
const uiError = ref('')

watch(resolvedValue, (value) => {
    inputValue.value = value ? JSON.stringify(value, null, 2) : ''
})

async function handleChange(event: Event): Promise<void> {
    const parsedValue = parseRefInput((event.target as HTMLTextAreaElement).value)
    if (parsedValue === undefined) {
        uiError.value = 'Value must be a JSON object with collection and id.'
        return
    }

    uiError.value = ''
    inputValue.value = JSON.stringify(parsedValue, null, 2)
    await props.onChange?.(parsedValue)
    emit('update:value', parsedValue)
}
</script>

<template>
    <InputField
        :exist="props.exist"
        :readable="props.readable"
        :writable="props.writable"
        :description="props.description"
        :error-message="uiError || props.errorMessage">
        <template #default="{ disabled }">
            <textarea
                :value="inputValue"
                class="textarea min-h-32 font-mono text-xs"
                :disabled="disabled"
                placeholder='{"collection":"School","id":"school-1","label":"Hogwarts"}'
                @change="handleChange" />
        </template>
    </InputField>
</template>
