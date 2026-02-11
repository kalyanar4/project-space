interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

const nowMs = () => Date.now();

export const consumeRateLimit = (key: string, limit: number, windowMs: number): RateLimitResult => {
  const now = nowMs();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const next: RateLimitBucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, next);
    return {
      allowed: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      resetAt: next.resetAt,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;
  const remaining = Math.max(limit - existing.count, 0);
  return {
    allowed: existing.count <= limit,
    limit,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
  };
};

export const __resetRateLimitStoreForTests = () => {
  buckets.clear();
};
