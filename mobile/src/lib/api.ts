import { API_URL } from '@/config';

/**
 * HTTP client, a fetch port of the website's apiClient.js (axios interceptors).
 *
 * The same contract the server expects from the site:
 *  - the session token goes in `Authorization: Bearer <token>`, never the URL;
 *  - the username rides along as a query parameter on GET and in the JSON body
 *    otherwise (the server resolves the account from it and checks the token);
 *  - 401 means the session is gone (expired, or superseded by a login on
 *    another device) and signs the app out;
 *  - 402 means "this feature needs a subscription": it is NEVER a lockout, the
 *    caller decides what to show, only the remaining free allowance is recorded.
 */

export class ApiError extends Error {
  status: number;
  data: any;
  /** 'network' = no response at all, 'timeout', 'aborted', or undefined. */
  code?: 'network' | 'timeout' | 'aborted';

  constructor(message: string, status: number, data: any, code?: ApiError['code']) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

export const isAborted = (err: unknown): boolean => err instanceof ApiError && err.code === 'aborted';

export type SessionCredentials = { username: string; token: string };

type Handlers = {
  /** Called when the server rejects the session (401) while one was held. */
  onSessionExpired?: () => void;
  /** Called on a 402 with the server's body (carries `remaining`). */
  onPaymentRequired?: (data: any) => void;
};

let session: SessionCredentials | null = null;
let handlers: Handlers = {};

export function setApiSession(next: SessionCredentials | null): void {
  session = next;
}

/** The current credentials, for the few callers that must put them in a body themselves. */
export function getApiSession(): SessionCredentials | null {
  return session;
}

export function setApiHandlers(next: Handlers): void {
  handlers = next;
}

export type RequestOptions = {
  params?: Record<string, unknown>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** false = never attach credentials (public endpoints, login). */
  auth?: boolean;
  headers?: Record<string, string>;
};

const DEFAULT_TIMEOUT_MS = 30_000;

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!params) return url;
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  if (!query) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${query}`;
}

async function request<T = any>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const { params, body, signal, timeoutMs = DEFAULT_TIMEOUT_MS, auth = true, headers = {} } = opts;
  const creds = auth ? session : null;

  const finalParams: Record<string, unknown> | undefined =
    creds && method === 'GET' ? { ...params, username: creds.username } : params;

  let finalBody: unknown = body;
  if (creds && method !== 'GET') {
    finalBody = body && typeof body === 'object' && !Array.isArray(body)
      ? { ...(body as object), username: creds.username }
      : { username: creds.username };
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onCallerAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onCallerAbort, { once: true });
  }

  const requestHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (finalBody !== undefined && method !== 'GET') requestHeaders['Content-Type'] = 'application/json';
  if (creds) requestHeaders.Authorization = `Bearer ${creds.token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, finalParams), {
      method,
      headers: requestHeaders,
      body: finalBody !== undefined && method !== 'GET' ? JSON.stringify(finalBody) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) throw new ApiError('Request timed out', 0, null, 'timeout');
    if (signal?.aborted || (err as { name?: string })?.name === 'AbortError') {
      throw new ApiError('Request aborted', 0, null, 'aborted');
    }
    throw new ApiError('Network error', 0, null, 'network');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 300) };
    }
  }

  if (!response.ok) {
    const message = (data && typeof data === 'object' && data.message) || `HTTP ${response.status}`;
    const error = new ApiError(String(message), response.status, data);
    if (response.status === 402) handlers.onPaymentRequired?.(data);
    // A 401 only means "signed out" when we actually sent a session: a wrong
    // password on /login is also a 401 and must not sign anyone out.
    if (response.status === 401 && creds) handlers.onSessionExpired?.();
    throw error;
  }

  return data as T;
}

export const api = {
  get: <T = any>(path: string, opts?: RequestOptions) => request<T>('GET', path, opts),
  post: <T = any>(path: string, body?: unknown, opts?: RequestOptions) => request<T>('POST', path, { ...opts, body }),
  put: <T = any>(path: string, body?: unknown, opts?: RequestOptions) => request<T>('PUT', path, { ...opts, body }),
  patch: <T = any>(path: string, body?: unknown, opts?: RequestOptions) => request<T>('PATCH', path, { ...opts, body }),
  delete: <T = any>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
};

/** Unwraps the server's own message for display, falling back to `fallback`. */
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const m = err.data && typeof err.data === 'object' ? err.data.message : null;
    if (typeof m === 'string' && m.trim()) return m;
  }
  return fallback;
}
