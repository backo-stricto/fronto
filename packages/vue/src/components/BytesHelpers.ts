const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

export function normalizeBytes(value: unknown): string | undefined {
    if (typeof value !== 'string' || !isValidBase64(value)) {
        return undefined
    }
    return value
}

export function isValidBase64(value: string): boolean {
    if (!BASE64_PATTERN.test(value)) {
        return false
    }

    try {
        return btoa(atob(value)) === value
    } catch {
        return false
    }
}

export function parseBytesInput(value: string): string | undefined {
    return normalizeBytes(value)
}

export function decodeBase64(value: string): Uint8Array {
    const binary = atob(value)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index)
    }
    return bytes
}

export function encodeBase64(bytes: Uint8Array): string {
    let binary = ''
    for (const byte of bytes) {
        binary += String.fromCharCode(byte)
    }
    return btoa(binary)
}

export function formatBytes(value: string): string {
    return `${decodeBase64(value).byteLength} bytes`
}

export async function fileToBase64(file: File): Promise<string> {
    return encodeBase64(new Uint8Array(await file.arrayBuffer()))
}
