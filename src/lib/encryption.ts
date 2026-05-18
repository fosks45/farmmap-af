/**
 * AES-256-GCM encryption for C3+ fields (Constitution §3).
 *
 * All C3 (Customer PII) and C4 (Customer Financial) fields are encrypted
 * at the application layer before being written to Supabase. The encryption
 * key is stored in Vercel environment secrets, never in the database.
 *
 * Algorithm: AES-256-GCM (authenticated encryption — provides both
 * confidentiality and integrity)
 *
 * Format on disk: base64("iv:ciphertext:authTag") — all three components
 * concatenated with ":" and base64-encoded for storage in text columns.
 *
 * Data classification: C0 (this module itself); the data it processes is C3/C4.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag

function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }
  return key;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string containing iv:ciphertext:authTag.
 *
 * @param plaintext - The string to encrypt (C3/C4 data)
 * @returns Encrypted base64 string suitable for database storage
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Pack: iv (12 bytes) + authTag (16 bytes) + ciphertext
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Throws if the ciphertext has been tampered with (auth tag mismatch).
 *
 * @param ciphertext - Base64 string from encrypt()
 * @returns Original plaintext string
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ciphertext;

  const key = getEncryptionKey();
  const combined = Buffer.from(ciphertext, 'base64');

  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Encrypts a value if it is non-null/undefined, otherwise returns null.
 * Convenience wrapper for nullable C3 fields.
 */
export function encryptNullable(value: string | null | undefined): string | null {
  if (value == null) return null;
  return encrypt(value);
}

/**
 * Decrypts a value if it is non-null, otherwise returns null.
 * Convenience wrapper for nullable C3 fields.
 */
export function decryptNullable(value: string | null | undefined): string | null {
  if (value == null) return null;
  return decrypt(value);
}

/**
 * Encrypts a JSON object (for C3 jsonb fields like delivery_address).
 * The entire object is serialised to JSON then encrypted as a string.
 */
export function encryptJson<T>(value: T): string {
  return encrypt(JSON.stringify(value));
}

/**
 * Decrypts a JSON object that was encrypted with encryptJson.
 */
export function decryptJson<T>(ciphertext: string): T {
  return JSON.parse(decrypt(ciphertext)) as T;
}
