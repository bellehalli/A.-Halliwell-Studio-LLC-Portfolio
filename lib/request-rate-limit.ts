type Bucket = { count: number; resetsAt: number };

// A small, bounded server-side guard for email-sending routes. Each Vercel
// function instance has its own buckets; add a project-wide WAF rate limit for
// an enforced limit across instances and regions.
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 4096;

export function checkRequestLimit(request: Request, route: string, max: number, windowMs: number) {
  const client = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown")
    .split(",")[0].trim().slice(0, 64);
  const key = `${route}:${client}`;
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetsAt <= now) {
    bucket = { count: 0, resetsAt: now + windowMs };
    buckets.set(key, bucket);
  }

  if (buckets.size > MAX_BUCKETS) {
    for (const [id, item] of buckets) if (item.resetsAt <= now) buckets.delete(id);
    while (buckets.size > MAX_BUCKETS) buckets.delete(buckets.keys().next().value!);
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.resetsAt - now) / 1000));
  if (bucket.count >= max) return { limited: true, retryAfter };
  bucket.count++;
  return { limited: false, retryAfter: 0 };
}
