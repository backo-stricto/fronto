import { describe, expect, it } from 'vitest'
import {
    decodeBase64,
    encodeBase64,
    isValidBase64,
    normalizeBytes,
} from '../src/components/BytesHelpers.js'

describe('BytesHelpers', () => {
    it('accepts canonical base64, including empty bytes', () => {
        expect(isValidBase64('')).toBe(true)
        expect(isValidBase64('SGVsbG8=')).toBe(true)
        expect(normalizeBytes('SGVsbG8=')).toBe('SGVsbG8=')
    })

    it('rejects malformed or whitespace-containing values', () => {
        expect(isValidBase64('SGVsbG8')).toBe(false)
        expect(isValidBase64('SG Vs bG8=')).toBe(false)
        expect(normalizeBytes('not base64')).toBeUndefined()
    })

    it('round-trips arbitrary byte values through the internal representation', () => {
        const bytes = new Uint8Array([0, 10, 127, 128, 255])
        expect(decodeBase64(encodeBase64(bytes))).toEqual(bytes)
    })
})
