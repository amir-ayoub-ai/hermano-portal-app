/**
 * Cliente HTTP da SAHF API.
 *
 * Sempre envia cookies (credentials: "include") para o Better-Auth funcionar.
 * Em dev: VITE_API_URL = http://localhost:8787 (default fallback)
 * Em prod: VITE_API_URL = https://api.hermanocorradi.com.br
 */

/**
 * Resolução da URL da API:
 *   1. VITE_API_URL (não-vazio e trimado) → sempre vence (staging/QA)
 *   2. PROD build sem VITE_API_URL → https://api.hermanocorradi.com.br
 *   3. DEV local sem VITE_API_URL → http://localhost:8787
 *
 * Importante: usamos `?.trim() || ...` (não `?? ...`) porque secret vazio
 * no GitHub Actions expande como string `""`, e `?? ""` deixaria passar.
 * Resultado seria URLs relativas tipo `fetch("/api/me")` caindo no SPA
 * fallback, devolvendo HTML 200 e quebrando AuthContext sem erro óbvio.
 */
const RAW_API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_URL =
  RAW_API_URL ||
  (import.meta.env.PROD
    ? "https://api.hermanocorradi.com.br"
    : "http://localhost:8787");

if (!API_URL || !/^https?:\/\//.test(API_URL)) {
  // Defensive — só dispara se o env e o fallback estiverem ambos zoados.
  throw new Error(
    `[api] API_URL inválida: "${API_URL}". Verifique VITE_API_URL no build.`,
  );
}

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

interface RequestOpts {
  /**
   * Timeout em ms. Default 10s. Use 25s pra endpoints que chamam ClickUp
   * (holding-phases, stage-info — paginação serial pode passar de 10s).
   */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const CLICKUP_TIMEOUT_MS = 25_000;

/**
 * Inferência simples de timeout: endpoints que sabidamente chamam ClickUp
 * ganham 25s. Resto fica em 10s.
 */
function timeoutForPath(path: string): number {
  if (/\/holding-phases|\/stage-info\//.test(path)) return CLICKUP_TIMEOUT_MS;
  return DEFAULT_TIMEOUT_MS;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  opts: RequestOpts = {},
): Promise<T> {
  const timeoutMs = opts.timeoutMs ?? timeoutForPath(path);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(0, `Tempo esgotado ao contatar a API (${timeoutMs}ms)`);
    }
    throw new ApiError(0, err instanceof Error ? err.message : "Erro de rede");
  }
  clearTimeout(timeoutId);

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
  get: <T,>(path: string, opts?: RequestOpts) => request<T>(path, {}, opts),
  post: <T,>(path: string, body?: unknown, opts?: RequestOpts) =>
    request<T>(
      path,
      { method: "POST", body: body ? JSON.stringify(body) : undefined },
      opts,
    ),
  patch: <T,>(path: string, body?: unknown, opts?: RequestOpts) =>
    request<T>(
      path,
      { method: "PATCH", body: body ? JSON.stringify(body) : undefined },
      opts,
    ),
  delete: <T,>(path: string, opts?: RequestOpts) =>
    request<T>(path, { method: "DELETE" }, opts),
};
