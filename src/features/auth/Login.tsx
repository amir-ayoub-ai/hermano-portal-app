import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { toast } from "sonner";

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      const target = user.role === "admin" ? "/admin" : "/dashboard";
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      navigate(from && from !== "/" ? from : target, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) toast.error(error);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </header>

      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex flex-col items-center">
          <Logo variant="vertical" className="h-28" />
          <p className="mt-6 text-center font-serif text-xl tracking-wide text-foreground/80">
            Portal do Cliente
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Acompanhe seu planejamento patrimonial
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-5 rounded-2xl border border-border bg-card/60 p-7 shadow-card-soft backdrop-blur-sm animate-fade-in"
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Entrando…
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          O acesso ao portal é restrito a clientes do escritório.
          <br />
          Em caso de dúvidas, entre em contato com nossa equipe.
        </p>
      </main>
    </div>
  );
}
