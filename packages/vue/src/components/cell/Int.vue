<script setup lang="ts">
    import { computed } from 'vue'
    import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
    import DisplayField from '../DisplayField.vue'
    import { useFrontoValue } from '../common.js'
    import { normalizeInt, formatInt } from '../IntHelpers.js'


    const props = defineProps<FrontoProps<'Int'>>()

    const resolvedValue = useFrontoValue(props, normalizeInt)

    const valueLabel = computed(() => formatInt(resolvedValue.value as number))

    const enumInvalid = computed(() => {
        console.log('[VUE/Cell] enumInvalid called with value:', resolvedValue.value, 'and enumValues:', props.enum)
        return !isValueInEnum<'Int'>(resolvedValue.value as number, props.enum)
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
