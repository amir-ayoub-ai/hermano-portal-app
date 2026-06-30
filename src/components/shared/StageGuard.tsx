import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isUnlocked, type ModuleId } from "@/types/domain";
import { toast } from "sonner";

interface StageGuardProps {
  moduleId: ModuleId;
  children: ReactNode;
}

export function StageGuard({ moduleId, children }: StageGuardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const allowed = !user || isAdmin || isUnlocked(moduleId, user);

  // Side-effects (toast) FORA do render — sob StrictMode o render roda 2x em
  // dev e dispararia 2 toasts. Em useEffect só dispara quando a tupla muda.
  useEffect(() => {
    if (!user || isAdmin || allowed) return;
    toast.error(
      moduleId === "sahf"
        ? "O SAHF é um programa exclusivo. Entre em contato com nossa equipe."
        : "Esta etapa ainda não foi desbloqueada para você.",
    );
  }, [moduleId, isAdmin, allowed, user]);

  if (!user) return null;
  if (allowed) return <>{children}</>;
  return <Navigate to="/dashboard" replace />;
}
