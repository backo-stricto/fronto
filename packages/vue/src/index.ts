import type { FrontoComponentSource } from '@fronto/core'

// Source files are published so @fronto/cli can copy them into consumer projects.
export const FRONTO_VUE_COMPONENT_SOURCES: ReadonlyArray<FrontoComponentSource> = [
    {
        strictoType: 'Bool',
        variant: 'input',
        sourcePath: 'src/components/input/Bool.vue',
    },
    {
        strictoType: 'Bool',
        variant: 'display',
        sourcePath: 'src/components/display/Bool.vue',
    },
    {
        strictoType: 'Bool',
        variant: 'cell',
        sourcePath: 'src/components/cell/Bool.vue',
    },
]
