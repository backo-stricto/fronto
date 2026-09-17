import { describe, expect, it } from 'vitest'
import { inferItemValueType, normalizeItem } from '../src/components/ItemHelpers.js'

describe('ItemHelpers', () => {
    it('normalizes item objects and rejects non-objects', () => {
        expect(normalizeItem({ name: 'Ada', age: 37 })).toEqual({ name: 'Ada', age: 37 })
        expect(normalizeItem([])).toBeUndefined()
        expect(normalizeItem(null)).toBeUndefined()
    })

    it('infers supported property types without treating objects as Items', () => {
        expect(inferItemValueType('Ada')).toBe('String')
        expect(inferItemValueType(37)).toBe('Int')
        expect(inferItemValueType(true)).toBe('Bool')
        expect(inferItemValueType(['admin'])).toBe('List')
        expect(inferItemValueType([{ collection: 'School', id: 'hogwarts' }])).toBe('RefsList')
        expect(inferItemValueType({ collection: 'School', id: 'hogwarts' })).toBe('Ref')
        expect(inferItemValueType({ nested: true })).toBe('Dict')
    })
})
