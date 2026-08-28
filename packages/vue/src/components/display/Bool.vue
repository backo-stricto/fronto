<script setup lang="ts">
    import { computed } from 'vue'
    import { FrontoProps, resolveFrontoProps } from '@backo-stricto/fronto-core'

    type BoolValue = boolean | null;
    type BoolProps = FrontoProps<'Bool'>;

    const props = defineProps<BoolProps>()

    const resolvedProps = resolveFrontoProps('Bool', props)

    function normalizeBool(value: any): BoolValue | undefined {
        if (value === true || value === false || value === null) {
            return value
        }
        return undefined
    }

    function resolveSourceValue(): any {
        if (props.value !== undefined) {
            return props.value
        }
        return props.defaultValue
    }

    const resolvedValue = computed<BoolValue>(() => {
        const source = resolveSourceValue()
        return normalizeBool(source) ?? null
    })

    const allowedValues = computed<BoolValue[]>(() => {
        return props.enum
            .map((item) => normalizeBool(item))
            .filter((item): item is BoolValue => item !== undefined)
    })

    const enumInvalid = computed(() => {
        if (allowedValues.value.length === 0 || resolvedValue.value === null) {
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
        if (resolvedValue.value === null) {
            return 'null'
        }
        if (resolvedValue.value === true) {
            return 'true'
        }
        return 'false'
    })
</script>

<template>
    <div v-if="exist" class="flex flex-col gap-1" :class="{ 'opacity-60': !readable }">
        <span class="badge badge-outline badge-sm uppercase" :class="{ 'opacity-60': resolvedValue === null }">
            <template v-if="readable">{{ valueLabel }}</template>
            <template v-else>
                <span aria-label="hidden value">····</span>
            </template>
        </span>
        <small v-if="description" class="text-xs text-base-content/60">{{ description }}</small>
        <small v-if="effectiveError" class="text-xs text-error">{{ effectiveError }}</small>
    </div>
</template>
