<script setup lang="ts">
    import { computed, ref } from 'vue'

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
        writable: true,
        description: '',
        required: false,
        defaultValue: null,
        value: undefined,
        errorMessage: '',
        enum: () => [true, false, null],
    })

    const emit = defineEmits<{
        'update:value': [value: BoolValue]
    }>()

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

    const isDisabled = computed(() => !props.exist || !props.readable || !props.writable)

    const isChecked = computed(() => resolvedValue.value === true)

    const checkedLabel = computed(() => {
        if (isChecked.value) {
            return 'true'
        }
        return 'false'
    })

    async function handleChange(event: Event): Promise<void> {
        if (isDisabled.value) {
            return
        }

        const nextValue: BoolValue = (event.target as HTMLInputElement).checked

        if (allowedValues.value.length > 0 && !allowedValues.value.includes(nextValue)) {
            uiError.value = 'Value must be one of enum values.'
            return
        }

        uiError.value = ''
        await props.onChange?.(nextValue)
        emit('update:value', nextValue)
    }
</script>

<template>
    <div class="flex flex-col gap-1.5" :class="{ 'opacity-60': isDisabled }">
        <label class="inline-flex items-center gap-2.5">
            <input type="checkbox" class="toggle toggle-primary" :checked="isChecked" :disabled="isDisabled"
                @change="handleChange">
            <span class="text-xs font-semibold uppercase tracking-wide">{{ checkedLabel }}</span>
        </label>

        <small v-if="description" class="text-xs text-base-content/60">{{ description }}</small>
        <small v-if="effectiveError" class="text-xs text-error">{{ effectiveError }}</small>
    </div>
</template>
