<script setup lang="ts">
import { reactive } from 'vue'
import {
    FRONTO_COMPONENTS_REGISTRY,
    FrontoComponentProps,
    FrontoTypeMap,
    resolveFrontoComponent,
} from './registry'
import { FrontoStrictoType, resolveFrontoProps } from '@backo-stricto/fronto-core'

const showCaseOverrides: Record<FrontoStrictoType, Partial<FrontoComponentProps<unknown>>> = {
    Bool: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A boolean value',
        required: false,
        defaultValue: false,
        value: false,
        enum: [true, false],
    },
    Int: {
        exist: true,
        readable: true,
        writable: true,
        description: 'An integer value',
        required: false,
        defaultValue: 0,
        value: 123,
        enum: undefined,
    },
    Float: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A floating-point value',
        required: false,
        defaultValue: 0.0,
        value: 123.45,
        enum: undefined,
    },
    String: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A string value',
        required: false,
        defaultValue: '',
        value: 'Hello, Fronto !',
        enum: undefined,
    },
    Datetime: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A datetime value',
        required: false,
        defaultValue: new Date(0).toISOString(),
        value: new Date().toISOString(),
        enum: undefined,
    },
    Bytes: {
        exist: true,
        readable: true,
        writable: true,
        description: 'Binary data encoded as base64',
        required: false,
        defaultValue: '',
        value: 'SGVsbG8sIEZyb250byE=',
        enum: undefined,
    },
    Dict: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A dictionary with values of different types',
        required: false,
        defaultValue: {},
        value: {
            greeting: 'Hello, Fronto!',
            answer: 42,
            enabled: true,
        },
        enum: undefined,
    },
    List: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A list of strings',
        required: false,
        defaultValue: [],
        value: ['Fronto', 'Stricto', 'Backo'],
        enum: undefined,
    },
    Item: {
        exist: true,
        readable: true,
        writable: true,
        description: 'An entity with scalar and compound properties',
        required: false,
        defaultValue: {},
        value: {
            name: 'Ada Lovelace',
            age: 36,
            roles: ['admin', 'author'],
            preferences: { theme: 'dark', notifications: true },
        },
        enum: undefined,
    },
    Ref: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A reference to another collection item',
        required: false,
        defaultValue: null,
        value: {
            collection: 'School',
            id: 'hogwarts',
            label: 'Hogwarts',
        },
        enum: undefined,
    },
    RefsList: {
        exist: true,
        readable: true,
        writable: true,
        description: 'A list of references to another collection',
        required: false,
        defaultValue: [],
        value: [
            {
                collection: 'School',
                id: 'hogwarts',
                label: 'Hogwarts',
            },
            {
                collection: 'School',
                id: 'beauxbatons',
                label: 'Beauxbatons',
            },
        ],
        enum: undefined,
    },
}

const VARIANTS = Array.from(
    new Set(
        Object.values(
            FRONTO_COMPONENTS_REGISTRY as Record<string, Record<string, unknown>>,
        ).flatMap((variants) => Object.keys(variants)),
    ),
)

const VARIANT_COLUMNS_COUNT = Math.max(VARIANTS.length, 1)
const SHOWCASE_PROP_KEYS = [
    'exist',
    'readable',
    'writable',
    'description',
    'required',
    'defaultValue',
    'value',
    'enum',
] as const

type ShowcasePropKey = (typeof SHOWCASE_PROP_KEYS)[number]
type ShowcaseEditorKind = 'boolean' | 'text' | 'json'
const PROPS_COLUMNS_COUNT = SHOWCASE_PROP_KEYS.length

const SHOWCASE_PROP_EDITORS: Record<ShowcasePropKey, ShowcaseEditorKind> = {
    exist: 'boolean',
    readable: 'boolean',
    writable: 'boolean',
    description: 'text',
    required: 'boolean',
    defaultValue: 'json',
    value: 'json',
    enum: 'json',
}

const variantColumnsTemplate =
    VARIANTS.length > 0
        ? VARIANTS.map((variant) => {
              const lowerVariant = variant.toLowerCase()
              if (lowerVariant === 'input') {
                  return 'max(250px, 20vw)'
              }
              if (lowerVariant === 'display') {
                  return 'max(200px, 15vw)'
              }
              return 'minmax(220px, 1fr)'
          }).join(' ')
        : 'minmax(220px, 1fr)'

const gridTemplateColumns = `minmax(120px, 160px) ${variantColumnsTemplate} repeat(${PROPS_COLUMNS_COUNT}, minmax(160px, 220px))`
const variantsGroupGridColumn = `2 / span ${VARIANT_COLUMNS_COUNT}`
const propsGroupGridColumn = `${2 + VARIANT_COLUMNS_COUNT} / span ${PROPS_COLUMNS_COUNT}`

const editableOverrides = reactive(
    Object.fromEntries(
        Object.entries(showCaseOverrides).map(([type, overrides]) => [type, { ...overrides }]),
    ) as Record<FrontoStrictoType, Partial<FrontoComponentProps<unknown>>>,
)

function isEditorKind(key: ShowcasePropKey, editorKind: ShowcaseEditorKind): boolean {
    return SHOWCASE_PROP_EDITORS[key] === editorKind
}

function getRawPropValue(type: FrontoStrictoType, key: ShowcasePropKey): unknown {
    return editableOverrides[type][key]
}

function getBooleanPropValue(type: FrontoStrictoType, key: ShowcasePropKey): string {
    return getRawPropValue(type, key) === true ? 'true' : 'false'
}

function setBooleanPropValue(type: FrontoStrictoType, key: ShowcasePropKey, value: string): void {
    editableOverrides[type][key] = value === 'true'
}

function getTextPropValue(type: FrontoStrictoType, key: ShowcasePropKey): string {
    const value = getRawPropValue(type, key)
    return typeof value === 'string' ? value : ''
}

function setTextPropValue(type: FrontoStrictoType, key: ShowcasePropKey, value: string): void {
    editableOverrides[type][key] = value
}

function getJsonPropValue(type: FrontoStrictoType, key: ShowcasePropKey): string {
    const value = getRawPropValue(type, key)
    if (value === undefined) {
        return ''
    }
    return JSON.stringify(value)
}

function setJsonPropValue(type: FrontoStrictoType, key: ShowcasePropKey, value: string): void {
    if (value.trim() === '') {
        editableOverrides[type][key] = undefined
        return
    }
    try {
        editableOverrides[type][key] = JSON.parse(value)
    } catch {
        // Keep last valid value while user is typing invalid JSON.
    }
}

function getComponentProps(
    type: FrontoStrictoType,
): FrontoComponentProps<FrontoTypeMap[typeof type]> {
    const props = resolveFrontoProps(type, editableOverrides[type])
    return props
}
</script>

<template>
    <main class="w-full p-8">
        <h1 class="mb-6 text-3xl font-bold tracking-tight">Fronto components showcase</h1>

        <section
            class="grid w-fit items-stretch gap-0 max-[740px]:grid-cols-1"
            :style="{ gridTemplateColumns }">
            <div class="border-b border-base-300 bg-base-300 px-4 py-2 max-[740px]:hidden" />

            <div
                class="border-b border-base-300 bg-base-300 px-4 py-2 text-center text-sm font-bold uppercase tracking-wide max-[740px]:hidden"
                :style="{ gridColumn: variantsGroupGridColumn }">
                Variants
            </div>

            <div
                class="border-b border-base-300 border-l border-l-base-300 bg-base-300 px-4 py-2 text-center text-sm font-bold uppercase tracking-wide max-[740px]:hidden"
                :style="{ gridColumn: propsGroupGridColumn }">
                Props
            </div>

            <div
                class="border-b border-base-300 bg-base-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/80 max-[740px]:hidden"></div>

            <div
                v-for="variant in VARIANTS"
                :key="`header-${variant}`"
                class="border-b border-base-300 bg-base-200 px-4 py-3 font-bold capitalize max-[740px]:hidden">
                {{ variant }}
            </div>

            <div
                v-for="(propKey, propIndex) in SHOWCASE_PROP_KEYS"
                :key="`header-prop-${propKey}`"
                class="border-b border-base-300 bg-base-200 px-3 py-3 font-bold max-[740px]:hidden"
                :class="{ 'border-l border-l-base-300': propIndex === 0 }">
                {{ propKey }}
            </div>

            <template
                v-for="(variants, type) in FRONTO_COMPONENTS_REGISTRY"
                :key="type">
                <div
                    class="border-b border-base-200 px-4 py-3 font-semibold max-[740px]:bg-base-200 max-[740px]:pb-1.5 max-[740px]:pt-5 max-[740px]:border-b-0">
                    {{ type }}
                </div>

                <div
                    v-for="variant in VARIANTS"
                    :key="`${type}-${variant}`"
                    class="border-b border-base-200 px-4 py-3">
                    <component
                        v-if="variant in variants"
                        :is="resolveFrontoComponent(type, variant)"
                        v-bind="getComponentProps(type)" />
                </div>

                <div
                    v-for="(propKey, propIndex) in SHOWCASE_PROP_KEYS"
                    :key="`${type}-${propKey}`"
                    class="border-b border-base-200 px-3 py-3"
                    :class="{ 'border-l border-l-base-300 bg-base-100/60': propIndex === 0 }">
                    <select
                        v-if="isEditorKind(propKey, 'boolean')"
                        class="select select-bordered select-xs w-full"
                        :value="getBooleanPropValue(type, propKey)"
                        @change="
                            setBooleanPropValue(
                                type,
                                propKey,
                                ($event.target as HTMLSelectElement).value,
                            )
                        ">
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>

                    <input
                        v-else-if="isEditorKind(propKey, 'text')"
                        class="input input-bordered input-xs w-full"
                        :value="getTextPropValue(type, propKey)"
                        @input="
                            setTextPropValue(
                                type,
                                propKey,
                                ($event.target as HTMLInputElement).value,
                            )
                        " />

                    <textarea
                        v-else
                        class="textarea textarea-bordered textarea-xs w-full min-h-16 font-mono"
                        :value="getJsonPropValue(type, propKey)"
                        @input="
                            setJsonPropValue(
                                type,
                                propKey,
                                ($event.target as HTMLTextAreaElement).value,
                            )
                        " />
                </div>
            </template>
        </section>
    </main>
</template>
