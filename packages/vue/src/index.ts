import {
    FRONTO_STRICTO_MANIFEST,
    FRONTO_STRICTO_TYPES,
    type FrontoComponentSource,
} from '@backo-stricto/fronto-core'

function buildVueComponentSource(variant: string, strictoType: string): string {
    return `src/components/${variant}/${strictoType}.vue`
}

function buildVueComponentSources(): FrontoComponentSource[] {
    const sources: FrontoComponentSource[] = []

    for (const strictoType of FRONTO_STRICTO_TYPES) {
        const manifestEntry = FRONTO_STRICTO_MANIFEST[strictoType]
        for (const variant of manifestEntry.supportedVariants) {
            sources.push({
                strictoType,
                variant,
                sourcePath: buildVueComponentSource(variant, strictoType),
            })
        }
    }

    return sources
}

export const FRONTO_VUE_COMPONENT_SOURCES: ReadonlyArray<FrontoComponentSource> =
    buildVueComponentSources()
