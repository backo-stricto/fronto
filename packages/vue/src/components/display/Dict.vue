<script setup lang="ts">
import type { FrontoProps } from '@backo-stricto/fronto-core'
import DisplayField from '../DisplayField.vue'
import { resolveNestedFrontoProps, useFrontoValue } from '../common.js'
import { inferDictValueType, normalizeDict } from '../DictHelpers.js'
import Bool from './Bool.vue'
import Bytes from './Bytes.vue'
import Datetime from './Datetime.vue'
import Float from './Float.vue'
import Int from './Int.vue'
import List from './List.vue'
import Ref from './Ref.vue'
import RefsList from './RefsList.vue'
import String from './String.vue'

const props = defineProps<FrontoProps<'Dict'>>()
const resolvedValue = useFrontoValue<'Dict'>(props, normalizeDict)

const scalarComponents = { Bool, Float, Int, String, Datetime, Bytes, Ref } as const
const compoundComponents = { List, Dict: 'Dict', RefsList } as const

function componentFor(value: unknown) {
    const type = inferDictValueType(value)
    if (type === 'List' || type === 'Dict' || type === 'RefsList') {
        return compoundComponents[type]
    }
    return type in scalarComponents ? scalarComponents[type as keyof typeof scalarComponents] : null
}

function valueProps(value: unknown) {
    const type = inferDictValueType(value)
    return resolveNestedFrontoProps(type, value, {
        writable: false,
    })
}
</script>

<template>
    <DisplayField
        variant="display"
        :exist="props.exist"
        :readable="props.readable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default>
            <div class="space-y-2">
                <div
                    v-for="(entryValue, key) in resolvedValue"
                    :key="key"
                    class="flex items-start gap-2">
                    <span class="min-w-20 pt-2 font-semibold">{{ key }}</span>
                    <component
                        v-if="componentFor(entryValue)"
                        :is="componentFor(entryValue)"
                        v-bind="valueProps(entryValue)" />
                    <span v-else>{{ JSON.stringify(entryValue) }}</span>
                </div>
            </div>
        </template>
    </DisplayField>
</template>
