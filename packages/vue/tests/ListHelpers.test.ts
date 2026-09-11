import { describe, expect, it } from 'vitest'
import { inferListItemType, normalizeList } from '../src/components/ListHelpers.js'

describe('ListHelpers', () => {
    it('normalizes arrays and rejects non-arrays', () => {
        expect(normalizeList(['one'])).toEqual(['one'])
        expect(normalizeList(undefined)).toBeUndefined()
    })

    it('infers supported item types from list values', () => {
        expect(inferListItemType('one')).toBe('String')
        expect(inferListItemType(1)).toBe('Int')
        expect(inferListItemType(1.5)).toBe('Float')
        expect(inferListItemType(true)).toBe('Bool')
        expect(inferListItemType([])).toBe('List')
        expect(inferListItemType('2026-09-11T12:00:00.000Z')).toBe('Datetime')
        expect(inferListItemType('SGVsbG8=')).toBe('Bytes')
    })
})
