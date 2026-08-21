<script lang="ts" setup>
    import { computed } from 'vue'

    type BoolValue = boolean | null

    type BoolProps = {
        onChange?: (value: BoolValue) => Promise<void> | void
        exist?: boolean
        readable?: boolean
        writable?: boolean
        description?: string
        required?: boolean
        defaultValue?: any
        value?: any
        errorMessage?: string
        enum?: Array<any>
    }

    const props = withDefaults(defineProps<BoolProps>(), {
        onChange: undefined,
        exist: true,
        readable: true,
        writable: false,
        description: '',
        required: false,
        defaultValue: null,
        value: undefined,
        errorMessage: '',
        enum: () => [],
    })

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

    const visibleLabel = computed(() => {
        if (!props.exist) {
            return 'N/A'
        }
        if (!props.readable) {
            return 'hidden'
        }
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
    <div class="inline-flex flex-col gap-0.5 leading-tight" :class="{ 'opacity-60': !exist || !readable }">
        <span>{{ visibleLabel }}</span>
        <small v-if="effectiveError" class="text-[0.7rem] text-error">{{ effectiveError }}</small>
    </div>
</template>
