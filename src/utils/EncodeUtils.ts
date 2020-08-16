const sha256 = require('sha256');

export function encodeBase64(text: string): string {
    const buffer = Buffer.from(text);
    return buffer.toString('base64');
}

export function encodeSha256(text:string): string {
    return sha256(text);
}