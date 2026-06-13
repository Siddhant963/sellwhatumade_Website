/** Normalized API error thrown by the client/server fetch helpers. */
export class ApiError extends Error {
  status: number;
  /** Machine-readable backend code, when provided. */
  code?: string;
  /** Raw parsed body for callers that need detail. */
  body?: unknown;

  constructor(status: number, message: string, code?: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

/** Pull a human-readable message out of a NestJS error body. */
export function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const m = (body as Record<string, unknown>).message;
    if (Array.isArray(m)) return m.join(", ");
    if (typeof m === "string") return m;
    const e = (body as Record<string, unknown>).error;
    if (typeof e === "string") return e;
  }
  return fallback;
}
