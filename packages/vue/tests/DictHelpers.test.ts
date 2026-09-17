import { describe, expect, it } from 'vitest'
import { inferDictValueType, normalizeDict } from '../src/components/DictHelpers.js'

describe('DictHelpers', () => {
    it('normalizes plain objects and rejects other values', () => {
        expect(
            normalizeDict({
                bool: true,
                bytes: 'SGVsbG8=',
                int: 1,
                float: 1.5,
                datetime: '2026-09-14T00:00:00.000Z',
                list: ['one'],
                dict: { nested: false },
                ref: 'reference',
                refsList: ['first', 'second'],
            }),
        ).toEqual({
            bool: true,
            bytes: 'SGVsbG8=',
            int: 1,
            float: 1.5,
            datetime: '2026-09-14T00:00:00.000Z',
            list: ['one'],
            dict: { nested: false },
            ref: 'reference',
            refsList: ['first', 'second'],
        })
        expect(normalizeDict([])).toBeUndefined()
        expect(normalizeDict(null)).toBeUndefined()
    })

    it('infers Dict values from their runtime values', () => {
        expect(inferDictValueType('one')).toBe('String')
        expect(inferDictValueType(1)).toBe('Int')
        expect(inferDictValueType(true)).toBe('Bool')
        expect(inferDictValueType(['one'])).toBe('List')
        expect(inferDictValueType([{ collection: 'School', id: 'hogwarts' }])).toBe('RefsList')
        expect(inferDictValueType({ collection: 'School', id: 'hogwarts' })).toBe('Ref')
        expect(inferDictValueType({ nested: true })).toBe('Dict')
    })
})
