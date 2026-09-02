import type { ApiError } from '@/types';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const TOKEN_KEY = 'dtcis_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string>;
  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiRequestError';
    this.status = apiError.status;
    this.errors = apiError.errors;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  isFormData?: boolean;
}

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal, isFormData = false } = opts;
  const url = `${API_BASE_URL}${path}`;
  const finalHeaders: Record<string, string> = { ...authHeaders(), ...headers };
  if (!isFormData) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? (isFormData ? (body as BodyInit) : JSON.stringify(body)) : undefined,
      signal,
    });
  } catch {
    throw new ApiRequestError({
      status: 0,
      message: 'Unable to reach the server. Please check your connection and try again.',
    });
  }

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else if (res.ok) {
    data = await res.text();
  }

  if (!res.ok) {
    const err = data as ApiError;
    throw new ApiRequestError({
      status: res.status,
      message: err?.message ?? 'An unexpected error occurred.',
      errors: err?.errors,
    });
  }
  return data as T;
}

export function buildQuery(params: Record<string, unknown> | object): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sp.append(key, String(value));
    }
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}
