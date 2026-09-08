<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
    import InputField from '../InputField.vue'
    import { useFrontoValue } from '../common'
    import { normalizeString, parseStringInput } from '../StringHelpers'


    const props = defineProps<FrontoProps<'String'>>()

    const emit = defineEmits<{
        'update:value': [value: string]
    }>()

    const resolvedValue = useFrontoValue(props, normalizeString)
    const inputValue = ref(resolvedValue.value)

    const enumInvalid = computed(() => {
        return !isValueInEnum<'String'>(resolvedValue.value, props.enum)
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
        const nextValue = parseStringInput(rawValue)

        if (nextValue === undefined) {
            uiError.value = 'Value must be a string.'
            return
        }
        if (!isValueInEnum<'String'>(nextValue, props.enum)) {
            uiError.value = 'Value must be one of enum values.'
            return
        }
        uiError.value = ''
        inputValue.value = nextValue
        await props.onChange?.(nextValue)
        emit('update:value', nextValue)
    }
</script>

<template>
    <InputField :exist="props.exist" :readable="props.readable" :writable="props.writable"
        :description="props.description" :error-message="effectiveError">
        <template #default="{ disabled }">
            <input v-model="inputValue" type="text" class="input" :placeholder="props.description" :disabled="disabled"
                @change="handleChange">
        </template>
    </InputField>
</template>
