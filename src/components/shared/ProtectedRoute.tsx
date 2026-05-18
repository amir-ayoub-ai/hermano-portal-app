import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types/domain";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: Role;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace state={{ from: location }} />;

  // Força troca de senha temporária antes de acessar qualquer outra rota
  if (
    user.mustChangePassword &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
