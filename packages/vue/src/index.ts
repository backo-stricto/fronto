import type { FrontoComponentSource } from '@backo-stricto/fronto-core'

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
