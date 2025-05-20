import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GraphQLClient, gql } from 'graphql-request';
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encrypt(
  text: string,
  cryptoKey: string,
  algorithm?: string
): string {
  const ALGORITHM = algorithm || 'aes-256-cbc';
  const IV_LENGTH = 16;
  const iv = crypto.randomBytes(IV_LENGTH);

  // Generate a 32-byte key from the cryptoKey
  const key = crypto.createHash('sha256').update(cryptoKey).digest();

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(
  encryptedKey: string,
  cryptoKey: string,
  algorithm?: string
): string {
  const ALGORITHM = algorithm || 'aes-256-cbc';
  const textParts = encryptedKey.split(':');
  const ivHex = textParts.shift();

  if (!ivHex) {
    throw new Error('Invalid input: Initialization vector (IV) is missing.');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');

  // Generate the same 32-byte key from the cryptoKey
  const key = crypto.createHash('sha256').update(cryptoKey).digest();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
