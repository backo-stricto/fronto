<script setup lang="ts">
    import { computed } from 'vue'
    import { FrontoProps } from '@backo-stricto/fronto-core'
    import DisplayField from '../DisplayField.vue'

    type BoolProps = FrontoProps<'Bool'>;

    const props = defineProps<BoolProps>()

    function normalizeBool(value: unknown): boolean | undefined {
        if (typeof value === 'boolean') {
            return value
        }
        return undefined
    }

    const resolvedValue = computed<boolean>(() => {
        const val = normalizeBool(props.value)
        if (typeof val === 'boolean') {
            return val
        }
        return normalizeBool(props.defaultValue) ?? false
    })

    const allowedValues = computed<boolean[]>(() => {
        const enumValues: unknown[] = Array.isArray(props.enum) ? props.enum : []
        return enumValues
            .map((item) => normalizeBool(item))
            .filter((item): item is boolean => item !== undefined)
    })

    const enumInvalid = computed(() => {
        if (allowedValues.value.length === 0) {
            return false
        }
        return !allowedValues.value.includes(resolvedValue.value)
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

    const valueLabel = computed(() => {
        if (resolvedValue.value) {
            return 'true'
        }
        return 'false'
    })
</script>

<template>
    <DisplayField variant="display" :exist="props.exist" :readable="props.readable" :description="props.description"
        :error-message="effectiveError">
        <template #default="{ disabled }">
            <span class="text-xs font-semibold uppercase tracking-wide cursor-default">
                <template v-if="readable">{{ valueLabel }}</template>
                <template v-else>
                    <span aria-label="hidden value">····</span>
                </template>
            </span>
        </template>
    </DisplayField>
</template>
