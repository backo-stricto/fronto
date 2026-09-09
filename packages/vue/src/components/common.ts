import { computed } from 'vue'
import { FrontoProps, FrontoTypeMap } from '@backo-stricto/fronto-core'

export function useFrontoValue<K extends keyof FrontoTypeMap>(
    props: Pick<FrontoProps<K>, 'value' | 'defaultValue'>,
    normalizeFn: (value: unknown) => FrontoTypeMap[K] | undefined,
) {
    return computed<FrontoTypeMap[K]>(() => {
        const value = normalizeFn(props.value)
        if (value !== undefined) {
            return value
        }
        const defaultValue = normalizeFn(props.defaultValue)
        if (defaultValue !== undefined) {
            return defaultValue
        }
        throw new Error('Invalid Fronto default value')
    })
}
