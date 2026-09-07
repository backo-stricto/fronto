<script setup lang="ts">
    import { computed } from 'vue'
    import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
    import DisplayField from '../DisplayField.vue'
    import { useFrontoValue } from '../common'
    import { normalizeBool, formatBool } from '../BoolHelpers'


    const props = defineProps<FrontoProps<'Bool'>>()

    const resolvedValue = useFrontoValue(props, normalizeBool)

    const valueLabel = computed(() => formatBool(resolvedValue.value))

    const allowedValues = computed<boolean[]>(() => {
        const enumValues: unknown[] = Array.isArray(props.enum) ? props.enum : []
        return enumValues
            .map((item) => normalizeBool(item))
            .filter((item): item is boolean => item !== undefined)
    })

    const enumInvalid = computed(() => {
        return !isValueInEnum<'Bool'>(resolvedValue.value, allowedValues.value)
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
            <span class="text-xs font-semibold uppercase tracking-wide cursor-default">
                <template v-if="readable">{{ valueLabel }}</template>
                <template v-else>
                    <span aria-label="hidden value">····</span>
                </template>
            </span>
        </template>
    </DisplayField>
</template>
