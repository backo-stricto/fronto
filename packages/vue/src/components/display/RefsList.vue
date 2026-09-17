<script setup lang="ts">
import type { FrontoProps } from '@backo-stricto/fronto-core'
import DisplayField from '../DisplayField.vue'
import { useFrontoValue } from '../common.js'
import { formatRef } from '../RefHelpers.js'
import { normalizeRefsList } from '../RefsListHelpers.js'

const props = defineProps<FrontoProps<'RefsList'>>()
const resolvedValue = useFrontoValue<'RefsList'>(props, normalizeRefsList)
</script>

<template>
    <DisplayField
        variant="display"
        :exist="props.exist"
        :readable="props.readable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default>
            <ul class="list-disc space-y-1 pl-5">
                <li
                    v-for="(item, index) in resolvedValue"
                    :key="index"
                    class="text-xs tracking-wide break-all">
                    {{ formatRef(item) }}
                </li>
            </ul>
        </template>
    </DisplayField>
</template>
