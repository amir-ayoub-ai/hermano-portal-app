import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Stage, User } from "@/types/domain";
import { api, ApiError } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  /** Atualiza a etapa do cliente logado (admin altera via painel admin). */
  setClientStage: (stage: Stage) => Promise<void>;
  /** Liga/desliga SAHF do cliente logado. */
  setClientSahf: (hasSahf: boolean) => Promise<void>;
  /** Recarrega o usuário do servidor. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface MeResponse {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "client";
  clientId: string | null;
  currentStage: Stage | null;
  hasSahf: boolean;
  mustChangePassword: boolean;
}

function toUser(me: MeResponse): User {
  return {
    id: me.id,
    email: me.email,
    fullName: me.fullName,
    role: me.role,
    clientId: me.clientId ?? undefined,
    currentStage: me.currentStage ?? undefined,
    hasSahf: me.hasSahf,
    mustChangePassword: me.mustChangePassword,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  const loadMe = useCallback(async () => {
    try {
      const me = await api.get<MeResponse>("/api/me");
      setState({ user: toUser(me), loading: false });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setState({ user: null, loading: false });
      } else {
        console.error("[auth] erro ao buscar /me:", err);
        setState({ user: null, loading: false });
      }
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (email, password) => {
      try {
        await api.post("/api/auth/sign-in/email", { email, password });
        await loadMe();
        return {};
      } catch (err) {
        if (err instanceof ApiError) {
          return {
            error:
              err.status === 401 || err.status === 400
                ? "E-mail ou senha incorretos."
                : err.message,
          };
        }
        return { error: "Falha de conexão com o servidor." };
      }
    },
    [loadMe],
  );

  const signOut = useCallback(async () => {
    try {
      await api.post("/api/auth/sign-out");
    } catch {
      // ignora — vamos limpar o estado local de qualquer forma
    }
    setState({ user: null, loading: false });
  }, []);

  const updateOwnClient = useCallback(
    async (patch: { currentStage?: Stage; hasSahf?: boolean }) => {
      const user = state.user;
      if (!user || user.role !== "client") return;

      // Atualiza otimisticamente
      setState((prev) =>
        prev.user ? { ...prev, user: { ...prev.user, ...patch } } : prev,
      );

      try {
        // Cliente atualizando próprios dados — endpoint admin precisaria, mas
        // mantemos só estado local enquanto o backend não tem self-update.
        // Em produção, a etapa virá do ClickUp via webhook.
        await loadMe();
      } catch {
        // mantém estado otimista
      }
    },
    [loadMe, state.user],
  );

  const setClientStage = useCallback<AuthContextValue["setClientStage"]>(
    (stage) => updateOwnClient({ currentStage: stage }),
    [updateOwnClient],
  );

  const setClientSahf = useCallback<AuthContextValue["setClientSahf"]>(
    (hasSahf) => updateOwnClient({ hasSahf }),
    [updateOwnClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signOut,
      setClientStage,
      setClientSahf,
      refresh: loadMe,
    }),
    [state, signIn, signOut, setClientStage, setClientSahf, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
