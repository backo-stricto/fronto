<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FrontoProps } from '@backo-stricto/fronto-core'
import InputField from '../InputField.vue'
import { useFrontoValue } from '../common'
import { inferListItemType, normalizeList } from '../ListHelpers'
import Bool from './Bool.vue'
import Float from './Float.vue'
import Int from './Int.vue'
import String from './String.vue'
import Datetime from './Datetime.vue'
import Bytes from './Bytes.vue'

const props = defineProps<FrontoProps<'List'>>()

const emit = defineEmits<{
    'update:value': [value: unknown[]]
}>()

const resolvedValue = useFrontoValue(props, normalizeList)
const inputValue = ref([...resolvedValue.value])

watch(resolvedValue, (value) => {
    inputValue.value = [...value]
})

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
        writable: true,
        description: '',
        errorMessage: '',
    }
}

async function updateItem(index: number, value: unknown): Promise<void> {
    const nextValue = [...inputValue.value]
    nextValue[index] = value
    inputValue.value = nextValue
    await props.onChange?.(nextValue)
    emit('update:value', nextValue)
}
</script>

<template>
    <InputField
        :exist="props.exist"
        :readable="props.readable"
        :writable="props.writable"
        :description="props.description"
        :error-message="props.errorMessage">
        <template #default>
            <ul class="list-disc space-y-1 pl-5">
                <li
                    v-for="(item, index) in inputValue"
                    :key="index">
                    <component
                        v-if="componentFor(item)"
                        :is="componentFor(item)"
                        v-bind="itemProps(item)"
                        @update:value="updateItem(index, $event)" />
                    <span v-else>{{ JSON.stringify(item) }}</span>
                </li>
            </ul>
        </template>
    </InputField>
</template>
