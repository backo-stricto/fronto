<script setup lang="ts">
import { computed, ref } from 'vue'
import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { useFrontoValue } from '../common'
import { normalizeBool } from '../BoolHelpers'

const props = defineProps<FrontoProps<'Bool'>>()

const emit = defineEmits<{
    'update:value': [value: boolean]
}>()

const resolvedValue = useFrontoValue(props, normalizeBool)

const enumInvalid = computed(() => {
    return !isValueInEnum<'Bool'>(resolvedValue.value, props.enum)
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
    const nextValue = (event.target as HTMLInputElement).checked

    if (!isValueInEnum<'Bool'>(nextValue, props.enum)) {
        uiError.value = 'Value must be one of enum values.'
        return undefined
    }
    uiError.value = ''
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
            <label class="inline-flex items-center gap-2.5">
                <input
                    type="checkbox"
                    class="toggle toggle-primary"
                    :checked="resolvedValue"
                    :disabled="disabled"
                    @change="handleChange" />
            </label>
        </template>
    </InputField>
</template>
