<script setup lang="ts">
import { computed } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'
import DisplayField from '../DisplayField.vue'
import { useFrontoValue } from '../common'
import { inferListItemType, normalizeList } from '../ListHelpers'
import Bool from './Bool.vue'
import Float from './Float.vue'
import Int from './Int.vue'
import String from './String.vue'
import Datetime from './Datetime.vue'
import Bytes from './Bytes.vue'

const props = defineProps<FrontoProps<'List'>>()

const resolvedValue = useFrontoValue(props, normalizeList)

const leafComponents = {
    Bool,
    Float,
    Int,
    String,
    Datetime,
    Bytes,
} as const

function componentFor(
    item: unknown,
): (typeof leafComponents)[keyof typeof leafComponents] | 'List' | null {
    const type = inferListItemType(item)
    if (type === 'List') {
        return 'List'
    }
    if (type in leafComponents) {
        return leafComponents[type as keyof typeof leafComponents]
    }
    return null
}

function itemProps(item: unknown) {
    return {
        value: item,
        defaultValue: item,
        exist: true,
        readable: true,
        writable: false,
        description: '',
        errorMessage: '',
    }
}

const effectiveError = computed(() => props.errorMessage || '')
</script>

<template>
    <DisplayField
        variant="display"
        :exist="props.exist"
        :readable="props.readable"
        :description="props.description"
        :error-message="effectiveError">
        <template #default>
            <ul class="list-disc space-y-1 pl-5">
                <li
                    v-for="(item, index) in resolvedValue"
                    :key="index">
                    <component
                        v-if="componentFor(item)"
                        :is="componentFor(item)"
                        v-bind="itemProps(item)" />
                    <span v-else>{{ JSON.stringify(item) }}</span>
                </li>
            </ul>
        </template>
    </DisplayField>
</template>
