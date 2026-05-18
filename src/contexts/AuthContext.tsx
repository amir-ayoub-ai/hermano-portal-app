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
import { MOCK_USERS } from "@/lib/mockData";

const STORAGE_KEY = "sahf.auth.v1";

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  /** Permite simular avanço de etapa no demo (admin OU dev). */
  setClientStage: (stage: Stage) => void;
  /** Liga/desliga o add-on SAHF para o cliente logado (demo). */
  setClientSahf: (hasSahf: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const user = raw ? (JSON.parse(raw) as User) : null;
      setState({ user, loading: false });
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  const persist = useCallback((user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (email, password) => {
      await new Promise((r) => setTimeout(r, 350));
      const found = MOCK_USERS.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password,
      );
      if (!found) return { error: "E-mail ou senha incorretos." };
      const { password: _pw, ...user } = found;
      void _pw;
      persist(user);
      setState({ user, loading: false });
      return {};
    },
    [persist],
  );

  const signOut = useCallback(() => {
    persist(null);
    setState({ user: null, loading: false });
  }, [persist]);

  const setClientStage = useCallback<AuthContextValue["setClientStage"]>(
    (stage) => {
      setState((prev) => {
        if (!prev.user) return prev;
        const user = { ...prev.user, currentStage: stage };
        persist(user);
        return { ...prev, user };
      });
    },
    [persist],
  );

  const setClientSahf = useCallback<AuthContextValue["setClientSahf"]>(
    (hasSahf) => {
      setState((prev) => {
        if (!prev.user) return prev;
        const user = { ...prev.user, hasSahf };
        persist(user);
        return { ...prev, user };
      });
    },
    [persist],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut, setClientStage, setClientSahf }),
    [state, signIn, signOut, setClientStage, setClientSahf],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
