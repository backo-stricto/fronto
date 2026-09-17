<script setup lang="ts">
import { computed } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'
import DisplayField from '../DisplayField.vue'
import { formatRef, normalizeRef } from '../RefHelpers.js'

const props = defineProps<FrontoProps<'Ref'>>()
const resolvedValue = computed(() => normalizeRef(props.value) ?? normalizeRef(props.defaultValue))

const valueLabel = computed(() => formatRef(resolvedValue.value))
</script>

<template>
    <DisplayField
        variant="display"
        :exist="props.exist"
        :readable="props.readable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default="{ readable }">
            <span class="text-xs tracking-wide cursor-default break-all">
                <template v-if="readable">{{ valueLabel }}</template>
                <template v-else><span aria-label="hidden value">····</span></template>
            </span>
        </template>
    </DisplayField>
</template>
