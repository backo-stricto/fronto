<script setup lang="ts">
    import { computed } from 'vue'
    import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
    import DisplayField from '../DisplayField.vue'
    import { useFrontoValue } from '../common.js'
    import { normalizeFloat, formatFloat } from '../FloatHelpers.js'


    const props = defineProps<FrontoProps<'Float'>>()

    const resolvedValue = useFrontoValue(props, normalizeFloat)

    const valueLabel = computed(() => formatFloat(resolvedValue.value as number))

    const enumInvalid = computed(() => {
        return !isValueInEnum<'Float'>(resolvedValue.value as number, props.enum)
    })

    const effectiveError = computed(() => {
        if (props.errorMessage) {
            return props.errorMessage
        }
        if (enumInvalid.value) {
            return 'Value must be one of enum values.'
        }
        return ''
    })
</script>

<template>
    <DisplayField variant="cell" :exist="props.exist" :readable="props.readable" :description="props.description"
        :error-message="effectiveError">
        <template #default="{ readable }">
            <span class="text-xs tracking-wide cursor-default">
                <template v-if="readable">{{ valueLabel }}</template>
                <template v-else>
                    <span aria-label="hidden value">····</span>
                </template>
            </span>
        </template>
    </DisplayField>
</template>
