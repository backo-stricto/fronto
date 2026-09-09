<script setup lang="ts">
import { computed, ref } from 'vue'
import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { useFrontoValue } from '../common'
import { normalizeInt, parseIntInput } from '../IntHelpers'

const props = defineProps<FrontoProps<'Int'>>()

const emit = defineEmits<{
    'update:value': [value: number]
}>()

const resolvedValue = useFrontoValue(props, normalizeInt)
const inputValue = ref(String(resolvedValue.value))

const enumInvalid = computed(() => {
    return !isValueInEnum<'Int'>(resolvedValue.value, props.enum)
})

const uiError = ref('')

const effectiveError = computed(() => {
    if (uiError.value) {
        return uiError.value
    }
    if (props.errorMessage) {
        return props.errorMessage
    }
    if (enumInvalid.value) {
        return 'Value must be one of enum values.'
    }
    return ''
})

async function handleChange(event: Event): Promise<void> {
    const rawValue = (event.target as HTMLInputElement).value
    const nextValue = parseIntInput(rawValue)

    if (nextValue === undefined) {
        uiError.value = 'Value must be an integer.'
        return
    }
    if (!isValueInEnum<'Int'>(nextValue, props.enum)) {
        uiError.value = 'Value must be one of enum values.'
        return
    }
    uiError.value = ''
    inputValue.value = String(nextValue)
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
            <input
                v-model="inputValue"
                type="text"
                class="input"
                :placeholder="props.description"
                inputmode="numeric"
                :disabled="disabled"
                @change="handleChange" />
        </template>
    </InputField>
</template>
