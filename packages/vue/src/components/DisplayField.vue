<script setup lang="ts">
import { computed } from 'vue'
import type { FrontoProps, FrontoComponentVariant } from '@backo-stricto/fronto-core'

type DisplayFieldVariant = Exclude<FrontoComponentVariant, 'input'>

type DisplayFieldProps = Pick<
    FrontoProps<'Bool'>,
    'exist' | 'readable' | 'description' | 'errorMessage'
> & {
    variant: DisplayFieldVariant
}

const props = defineProps<DisplayFieldProps>()

const isVisible = computed(() => props.exist !== false)
const isReadable = computed(() => props.readable !== false)
const isDisabled = computed(() => !isReadable.value)
const containerClass = computed(() => {
    if (props.variant === 'cell') {
        return 'inline-flex flex-col gap-0.5 leading-tight'
    }
    return 'flex flex-col gap-1.5'
})
</script>

<template>
    <div
        v-if="isVisible"
        :class="[containerClass, { 'opacity-60': isDisabled }]">
        <div
            class="tooltip tooltip-top z-50"
            :data-tip="props.description">
            <span class="text-xs tracking-wide cursor-default">
                <slot
                    :disabled="isDisabled"
                    :readable="isReadable" />
            </span>
        </div>
        <div
            v-if="errorMessage"
            class="tooltip tooltip-error inline-flex items-center"
            :data-tip="errorMessage">
            <span class="text-error cursor-help text-xs">⚠️</span>
        </div>
    </div>
</template>
