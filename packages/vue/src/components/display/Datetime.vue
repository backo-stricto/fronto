<script setup lang="ts">
    import { computed } from 'vue'
    import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
    import DisplayField from '../DisplayField.vue'
    import { useFrontoValue } from '../common'
    import { normalizeDatetime, formatDatetime } from '../DatetimeHelpers'


    const props = defineProps<FrontoProps<'Datetime'>>()

    const resolvedValue = useFrontoValue(props, normalizeDatetime)
    const valueLabel = computed(() => formatDatetime(resolvedValue.value))

    const enumInvalid = computed(() => {
        return !isValueInEnum<'Datetime'>(resolvedValue.value, props.enum)
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
    <DisplayField variant="display" :exist="props.exist" :readable="props.readable" :description="props.description"
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
