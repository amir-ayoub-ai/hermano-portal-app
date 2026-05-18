/**
 * Solicitação de nova senha.
 * Não confirma se o email existe (evita enumeração).
 * Backend marca a flag pra o admin gerar nova senha e enviar via WhatsApp.
 */
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/auth-extras/forgot-password", { email });
      setSent(true);
    } catch {
      // Resposta neutra mesmo em erro — não revela existência
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </header>

      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
        <Logo variant="vertical" className="h-20" />

        <div className="mt-8 w-full rounded-2xl border border-border bg-card/60 p-7 shadow-card-soft backdrop-blur-sm animate-fade-in">
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-3">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao login
            </Link>
          </Button>

          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-xl">Pedido recebido</h1>
              <p className="text-sm text-muted-foreground">
                Se este e-mail estiver cadastrado, nossa equipe entrará em
                contato em breve pelo WhatsApp com uma nova senha temporária.
              </p>
              <Button asChild variant="gold" className="w-full">
                <Link to="/">Voltar ao login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h1 className="font-serif text-xl">Esqueci minha senha</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Informe seu e-mail e nossa equipe enviará uma nova senha via
                  WhatsApp.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail cadastrado</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="seu@email.com"
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  "Solicitar nova senha"
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
