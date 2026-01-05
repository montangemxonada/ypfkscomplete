import * as CryptoJS from 'crypto-js';

function sha256Hex(text: string): string {
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}

function hmacSha256Hex(secret: string, text: string): string {
  return CryptoJS.HmacSHA256(text, secret).toString(CryptoJS.enc.Hex);
}

export function makeSignedHeaders(secret: string, method: string, path: string, bodyObj: any) {
  const ts = Date.now().toString();
  const nonce = crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now());

  const bodyJson = JSON.stringify(bodyObj ?? {});
  const bodyHash = sha256Hex(bodyJson);

  const base = `${ts}.${nonce}.${method.toUpperCase()}.${path}.${bodyHash}`;
  const sig = hmacSha256Hex(secret, base);

  return {
    'x-ts': ts,
    'x-nonce': nonce,
    'x-sig': sig
  };
}
