<script setup lang="ts">
import { ref } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { useFrontoValue } from '../common.js'
import { normalizeRefsList, parseRefsListInput } from '../RefsListHelpers.js'

const props = defineProps<FrontoProps<'RefsList'>>()
const emit = defineEmits<{ 'update:value': [value: FrontoProps<'RefsList'>['value']] }>()

const resolvedValue = useFrontoValue<'RefsList'>(props, normalizeRefsList)
const inputValue = ref(JSON.stringify(resolvedValue.value, null, 2))
const uiError = ref('')

async function handleChange(event: Event): Promise<void> {
    const parsedValue = parseRefsListInput((event.target as HTMLTextAreaElement).value)
    if (parsedValue === undefined) {
        uiError.value = 'Value must be a JSON array of Ref objects.'
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
                class="textarea min-h-36 font-mono text-xs"
                :disabled="disabled"
                placeholder='[{"collection":"School","id":"school-1","label":"Hogwarts"}]'
                @change="handleChange" />
        </template>
    </InputField>
</template>
