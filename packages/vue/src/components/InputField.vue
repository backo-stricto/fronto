<script setup lang="ts">
import { computed } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'

type InputFieldProps = Pick<
    FrontoProps<'Bool'>,
    'exist' | 'readable' | 'writable' | 'description' | 'errorMessage'
>

const props = defineProps<InputFieldProps>()

const isVisible = computed(() => props.exist !== false)
const isReadable = computed(() => props.readable !== false)
const isWritable = computed(() => props.writable !== false)
const isDisabled = computed(() => !isReadable.value || !isWritable.value)
</script>

<template>
    <div
        v-if="isVisible"
        class="flex flex-col gap-1.5"
        :class="{ 'opacity-60': isDisabled }">
        <div
            class="tooltip tooltip-top z-50"
            :data-tip="props.description">
            <span class="text-xs tracking-wide cursor-default">
                <slot
                    :disabled="isDisabled"
                    :readable="isReadable"
                    :writable="isWritable" />
            </span>
        </div>
        <small
            v-if="errorMessage"
            class="text-xs text-error"
            >{{ errorMessage }}</small
        >
    </div>
</template>
