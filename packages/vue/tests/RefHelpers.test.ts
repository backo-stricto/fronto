import { describe, expect, it } from 'vitest'
import { formatRef, normalizeRef, parseRefInput } from '../src/components/RefHelpers.js'

describe('RefHelpers', () => {
    it('normalizes valid ref values and rejects invalid values', () => {
        expect(normalizeRef({ collection: 'School', id: 'hogwarts' })).toEqual({
            collection: 'School',
            id: 'hogwarts',
        })
        expect(normalizeRef(null)).toBeUndefined()
        expect(normalizeRef({ id: 'hogwarts' })).toBeUndefined()
        expect(normalizeRef('school:hogwarts')).toBeUndefined()
    })

    it('formats ref labels with fallback to collection:id', () => {
        expect(formatRef({ collection: 'School', id: 1, label: 'Hogwarts' })).toBe('Hogwarts')
        expect(formatRef({ collection: 'School', id: 1 })).toBe('School:1')
        expect(formatRef(undefined)).toBe('(unlinked)')
    })

    it('parses JSON text into ref values', () => {
        expect(parseRefInput('{"collection":"School","id":"hogwarts"}')).toEqual({
            collection: 'School',
            id: 'hogwarts',
        })
        expect(parseRefInput('null')).toBeUndefined()
        expect(parseRefInput('not-json')).toBeUndefined()
    })
})
