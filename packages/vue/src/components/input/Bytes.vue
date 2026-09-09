<script setup lang="ts">
import { computed, ref } from 'vue'
import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { fileToBase64, normalizeBytes, parseBytesInput } from '../BytesHelpers.js'

const props = defineProps<FrontoProps<'Bytes'>>()
const emit = defineEmits<{ 'update:value': [value: string] }>()
const resolvedValue = computed(
    () => normalizeBytes(props.value) ?? normalizeBytes(props.defaultValue) ?? '',
)
const inputValue = ref(resolvedValue.value)
const isFileValue = ref(false)
const uiError = ref('')
const displayedInputValue = computed(() => {
    if (!isFileValue.value || inputValue.value.length <= 100) {
        return inputValue.value
    }
    return `${inputValue.value.slice(0, 100)}[...]`
})
const effectiveError = computed(
    () =>
        uiError.value ||
        props.errorMessage ||
        (!isValueInEnum<'Bytes'>(resolvedValue.value, props.enum)
            ? 'Value must be one of enum values.'
            : ''),
)

async function updateValue(nextValue: string): Promise<void> {
    if (!isValueInEnum<'Bytes'>(nextValue, props.enum)) {
        uiError.value = 'Value must be one of enum values.'
        return
    }
    uiError.value = ''
    isFileValue.value = false
    inputValue.value = nextValue
    await props.onChange?.(nextValue)
    emit('update:value', nextValue)
}

async function handleTextChange(event: Event): Promise<void> {
    const nextValue = parseBytesInput((event.target as HTMLInputElement).value)
    if (nextValue === undefined) {
        uiError.value = 'Value must be a valid base64 string.'
        return
    }
    await updateValue(nextValue)
}

async function handleFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const nextValue = await fileToBase64(file)
    if (!isValueInEnum<'Bytes'>(nextValue, props.enum)) {
        uiError.value = 'Value must be one of enum values.'
        return
    }
    uiError.value = ''
    inputValue.value = nextValue
    isFileValue.value = true
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
        :error-message="effectiveError">
        <template #default="{ disabled }">
            <div class="flex flex-col gap-2">
                <input
                    :value="displayedInputValue"
                    type="text"
                    class="input"
                    placeholder="Base64 value"
                    :disabled="disabled"
                    @change="handleTextChange" />
                <input
                    type="file"
                    class="file-input"
                    :disabled="disabled"
                    @change="handleFileChange" />
            </div>
        </template>
    </InputField>
</template>
