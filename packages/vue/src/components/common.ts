import { computed } from 'vue'
import {
    FrontoProps,
    FrontoStrictoType,
    FrontoTypeMap,
    resolveFrontoProps,
} from '@backo-stricto/fronto-core'

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

export function resolveNestedFrontoProps<T extends keyof FrontoTypeMap>(
    type: T,
    value: FrontoTypeMap[T],
    overrides: Partial<FrontoProps<T>> = {},
): FrontoProps<T> {
    return resolveFrontoProps(type, {
        ...overrides,
        value,
    })
}

export function isCompoundFrontoType(type: FrontoStrictoType): type is 'List' | 'Dict' {
    return type === 'List' || type === 'Dict'
}
