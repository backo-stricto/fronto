<script setup lang="ts">
import { computed } from 'vue'
import { FrontoProps, isValueInEnum } from '@backo-stricto/fronto-core'
import DisplayField from '../DisplayField.vue'
import { useFrontoValue } from '../common'
import { formatBytes, normalizeBytes } from '../BytesHelpers'

const props = defineProps<FrontoProps<'Bytes'>>()
const resolvedValue = useFrontoValue(props, normalizeBytes)
const valueLabel = computed(() => `${formatBytes(resolvedValue.value)} · ${resolvedValue.value}`)
const enumInvalid = computed(() => !isValueInEnum<'Bytes'>(resolvedValue.value, props.enum))
const effectiveError = computed(
    () => props.errorMessage || (enumInvalid.value ? 'Value must be one of enum values.' : ''),
)
</script>

<template>
    <DisplayField
        variant="display"
        :exist="props.exist"
        :readable="props.readable"
        :description="props.description"
        :error-message="effectiveError">
        <template #default="{ readable }">
            <span class="text-xs tracking-wide cursor-default break-all">
                <template v-if="readable">{{ valueLabel }}</template>
                <template v-else><span aria-label="hidden value">····</span></template>
            </span>
        </template>
    </DisplayField>
</template>
