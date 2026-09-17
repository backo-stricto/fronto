import { describe, expect, it } from 'vitest'
import { normalizeRefsList, parseRefsListInput } from '../src/components/RefsListHelpers.js'

describe('RefsListHelpers', () => {
    it('normalizes arrays of refs and rejects invalid lists', () => {
        expect(
            normalizeRefsList([
                { collection: 'School', id: 'hogwarts' },
                { collection: 'School', id: 'beauxbatons' },
            ]),
        ).toEqual([
            { collection: 'School', id: 'hogwarts' },
            { collection: 'School', id: 'beauxbatons' },
        ])
        expect(normalizeRefsList([])).toEqual([])
        expect(normalizeRefsList([{ id: 'hogwarts' }])).toBeUndefined()
        expect(normalizeRefsList('not-a-list')).toBeUndefined()
    })

    it('parses JSON text into refs lists', () => {
        expect(parseRefsListInput('[{"collection":"School","id":"hogwarts"}]')).toEqual([
            { collection: 'School', id: 'hogwarts' },
        ])
        expect(parseRefsListInput('')).toEqual([])
        expect(parseRefsListInput('[{"id":"hogwarts"}]')).toBeUndefined()
    })
})
