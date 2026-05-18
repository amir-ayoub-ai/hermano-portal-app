import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { StageGuard } from "@/components/shared/StageGuard";
import { AppShell } from "@/components/shared/AppShell";

import Login from "@/features/auth/Login";
import HomeScreen from "@/features/home/HomeScreen";
import SVModule from "@/features/sv/SVModule";
import CroquiModule from "@/features/croqui/CroquiModule";
import HoldingModule from "@/features/holding/HoldingModule";
import SAHFModule from "@/features/sahf/SAHFModule";
import Admin from "@/features/admin/Admin";

function ClientHome() {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return (
    <AppShell>
      <HomeScreen />
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ClientHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sv"
              element={
                <ProtectedRoute>
                  <StageGuard moduleId="sv">
                    <AppShell>
                      <SVModule />
                    </AppShell>
                  </StageGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/croqui"
              element={
                <ProtectedRoute>
                  <StageGuard moduleId="croqui">
                    <AppShell>
                      <CroquiModule />
                    </AppShell>
                  </StageGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/holding"
              element={
                <ProtectedRoute>
                  <StageGuard moduleId="holding">
                    <AppShell>
                      <HoldingModule />
                    </AppShell>
                  </StageGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sahf"
              element={
                <ProtectedRoute>
                  <StageGuard moduleId="sahf">
                    <AppShell>
                      <SAHFModule />
                    </AppShell>
                  </StageGuard>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AppShell>
                    <Admin />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster
            theme="system"
            position="top-right"
            richColors
            closeButton
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
