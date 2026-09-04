import { computed } from 'vue'
import { FrontoProps, FrontoTypeMap } from '@backo-stricto/fronto-core'


export function useFrontoValue<T>(
    props: Pick<FrontoProps<T extends keyof FrontoTypeMap ? T : never>, 'value' | 'defaultValue'>,
    normalizeFn: (value: unknown) => T | undefined
) {
    return computed<T>(() => {
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
