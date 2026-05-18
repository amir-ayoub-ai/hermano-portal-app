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
  if (!user) return null;
  if (user.role === "admin") return <>{children}</>;

  if (!isUnlocked(moduleId, user)) {
    toast.error(
      moduleId === "sahf"
        ? "O SAHF é um programa exclusivo. Entre em contato com nossa equipe."
        : "Esta etapa ainda não foi desbloqueada para você.",
    );
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
