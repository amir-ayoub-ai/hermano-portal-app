/**
 * Cliente HTTP da SAHF API.
 *
 * Sempre envia cookies (credentials: "include") para o Better-Auth funcionar.
 * Em dev: VITE_API_URL = http://localhost:3000
 * Em prod: VITE_API_URL = https://api.hermanocorradi.com.br
 */

/**
 * Resolução da URL da API:
 *   1. VITE_API_URL (env var) → sempre vence (útil pra staging/QA)
 *   2. PROD build → https://api.hermanocorradi.com.br (padrão de produção)
 *   3. DEV local → http://localhost:3000
 */
const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD
    ? "https://api.hermanocorradi.com.br"
    : "http://localhost:3000");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data
        ? String(data.error)
        : null) ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
};
