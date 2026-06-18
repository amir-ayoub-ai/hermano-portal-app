/**
 * Página de troca de senha.
 *
 * Dois modos:
 *  - Forçada (1º login após receber senha temp): mostra mensagem "Defina uma
 *    nova senha pra continuar". Sem opção de cancelar.
 *  - Voluntária (perfil): cliente pode trocar quando quiser.
 *
 * Detecta o modo pelo flag mustChangePassword do user logado.
 */
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function ChangePassword() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const forced = !!user?.mustChangePassword;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("A confirmação não corresponde à nova senha.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/me/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Senha alterada com sucesso!");
      await refresh();
      navigate(user?.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro inesperado";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </header>

      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
        <Logo variant="vertical" className="h-20" />

        <div className="mt-8 w-full rounded-2xl border border-border bg-card/60 p-7 shadow-card-soft backdrop-blur-sm animate-fade-in">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-navy">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl">
                {forced ? "Defina sua nova senha" : "Alterar senha"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {forced
                  ? "Por segurança, troque sua senha temporária."
                  : "Atualize sua senha de acesso."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">
                {forced ? "Senha temporária recebida" : "Senha atual"}
              </Label>
              <PasswordInput
                id="current"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new">Nova senha</Label>
              <PasswordInput
                id="new"
                required
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="mínimo 8 caracteres"
                leftIcon={null}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <PasswordInput
                id="confirm"
                required
                autoComplete="new-password"
                value={confirmPassword}
                leftIcon={null}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                "Salvar nova senha"
              )}
            </Button>

            {!forced && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
