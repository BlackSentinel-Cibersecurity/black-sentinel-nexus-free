import { Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';

let cached: string | undefined;

/**
 * The single JWT signing secret shared by the REST API, the passport strategy
 * and the websocket gateway.
 *
 * SECURITY FIX: this used to fall back to a secret written in the source
 * ('blacksentinel-nexus-secret-key-2024'), so any install started without
 * JWT_SECRET accepted admin tokens anyone could mint. There is no built-in
 * secret any more: without a real JWT_SECRET the API signs with a random
 * per-process secret (sessions end when it restarts). Run scripts/init-env.sh
 * once to keep a persistent one in .env.
 */
export function jwtSecret(): string {
  if (cached) return cached;
  const fromEnv = process.env.JWT_SECRET?.trim();
  if (
    fromEnv &&
    fromEnv.length >= 32 &&
    !/change|your-|example|placeholder|fallback/i.test(fromEnv)
  ) {
    cached = fromEnv;
    return cached;
  }
  Logger.warn(
    fromEnv
      ? 'JWT_SECRET is shorter than 32 characters or still a placeholder; using a random secret for this run instead.'
      : 'JWT_SECRET is not set; using a random secret for this run. Sessions end when the API restarts. Run scripts/init-env.sh to keep one.',
    'Security',
  );
  cached = randomBytes(32).toString('hex');
  return cached;
}
