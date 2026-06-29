// Security utilities for the application

// Rate limiting store (in-memory for simplicity, use Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000,
): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true };
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// URL validation to prevent SSRF attacks
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow HTTP/HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    // Block localhost and private IPs
    const hostname = parsed.hostname.toLowerCase();
    const blockedHosts = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "[::1]",
      "169.254.169.254", // AWS metadata
    ];

    if (blockedHosts.some((h) => hostname === h || hostname.startsWith(h))) {
      return false;
    }

    // Block private IP ranges
    const privateIpRanges = [/^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./];

    if (privateIpRanges.some((regex) => regex.test(hostname))) {
      return false;
    }

    // Block internal network domains
    const blockedDomains = [".local", ".internal", ".corp"];

    if (blockedDomains.some((d) => hostname.endsWith(d))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 2000); // Limit length
}
