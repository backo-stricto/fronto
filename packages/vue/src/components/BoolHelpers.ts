export function normalizeBool(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') {
        return value;
    }
    return undefined;
}
