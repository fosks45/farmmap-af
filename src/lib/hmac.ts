/**
 * HMAC-SHA256 hashing utilities for C3 lookup fields.
 *
 * Used for:
 * - email_hash: HMAC of email address for de-duplication without decrypting all rows
 * - session_bucket: HMAC of IP + user-agent + date for analytics pseudonymisation
 * - actor_id_hash: HMAC of user_id + audit_secret for audit log (no raw UUID)
 * - ip_hash: HMAC of IP + daily salt for consent records (Constitution §3)
 *
 * Data classification: C0 (the hashes themselves are one-way; cannot recover PII)
 */

import { createHmac } from 'crypto';

function getHmacKey(): Buffer {
  const keyHex = process.env.EMAIL_HMAC_KEY;
  if (!keyHex) {
    throw new Error('EMAIL_HMAC_KEY environment variable is not set');
  }
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('EMAIL_HMAC_KEY must be 32 bytes (64 hex characters)');
  }
  return key;
}

/**
 * Generates an HMAC-SHA256 hash of the input using the EMAIL_HMAC_KEY.
 * Returns a 64-character hex string.
 */
export function hmacSha256(input: string): string {
  const key = getHmacKey();
  return createHmac('sha256', key).update(input, 'utf8').digest('hex');
}

/**
 * Generates an email hash for de-duplication lookups.
 * Normalises email to lowercase before hashing.
 */
export function hashEmail(email: string): string {
  return hmacSha256(email.toLowerCase().trim());
}

/**
 * Generates a daily-rotated session bucket for analytics.
 * Input: IP address + user agent + date (YYYY-MM-DD)
 * Returns: first 16 hex chars (8 bytes) for the session_bucket varchar(16)
 * This is pseudonymised and cannot be reversed to identify the user.
 */
export function sessionBucket(ip: string, userAgent: string, date: string): string {
  const input = `${ip}|${userAgent}|${date}`;
  return hmacSha256(input).substring(0, 16);
}

/**
 * Generates an IP hash for consent records.
 * Combines IP with a daily salt so consecutive lookups cannot be correlated across days.
 * The daily salt changes at midnight UTC.
 */
export function hashIp(ip: string): string {
  const todayUtc = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
  return hmacSha256(`ip:${ip}:${todayUtc}`);
}

/**
 * Generates an actor hash for audit log entries.
 * Uses a dedicated audit_secret suffix to separate audit hashes from email hashes.
 */
export function hashActorId(userId: string): string {
  return hmacSha256(`audit:actor:${userId}`);
}
