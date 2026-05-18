/**
 * Modal de criação manual de cliente.
 *
 * Campos mínimos: nome + e-mail (resto é opcional).
 * A senha temporária é gerada pelo backend e mostrada ao admin
 * pra copiar e enviar via WhatsApp.
 */
import { useState, type FormEvent } from "react";
import { Copy, KeyRound, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, type NewClientInput } from "@/lib/clients";
import type { Client, Stage } from "@/types/domain";

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (client: Client) => void;
}

const STAGE_LABEL: Record<Stage, string> = {
  sv: "Sessão de Viabilidade",
  croqui: "Projeto Estrutural",
  holding: "Holding Familiar",
};

export function NewClientModal({
  open,
  onOpenChange,
  onCreated,
}: NewClientModalProps) {
  const [form, setForm] = useState<NewClientInput>({
    fullName: "",
    email: "",
    whatsapp: "",
    cpf: "",
    clickupTaskId: "",
    currentStage: "sv",
  });
  const [submitting, setSubmitting] = useState(false);
  // Resultado após criar — mostra senha temporária pro admin
  const [createdResult, setCreatedResult] = useState<{
    name: string;
    email: string;
    tempPassword: string;
  } | null>(null);

  function resetAndClose() {
    setForm({
      fullName: "",
      email: "",
      whatsapp: "",
      cpf: "",
      clickupTaskId: "",
      currentStage: "sv",
    });
    setCreatedResult(null);
    onOpenChange(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: NewClientInput = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        currentStage: form.currentStage ?? "sv",
        hasSahf: false,
      };
      if (form.whatsapp?.trim()) payload.whatsapp = form.whatsapp.trim();
      if (form.cpf?.trim()) payload.cpf = form.cpf.trim();
      if (form.clickupTaskId?.trim())
        payload.clickupTaskId = form.clickupTaskId.trim();

      const result = await createClient(payload);
      onCreated(result.client);
      if (result.tempPassword) {
        setCreatedResult({
          name: result.client.fullName,
          email: result.client.email,
          tempPassword: result.tempPassword,
        });
      } else {
        toast.success("Cliente criado com sucesso!");
        resetAndClose();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar cliente");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyPassword() {
    if (!createdResult) return;
    try {
      await navigator.clipboard.writeText(createdResult.tempPassword);
      toast.success("Senha copiada — cole no WhatsApp do cliente.");
    } catch {
      toast.error("Selecione e copie manualmente.");
    }
  }

  // Tela de "cliente criado" com senha
  if (createdResult) {
    return (
      <Dialog open={open} onOpenChange={resetAndClose}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-navy">
              <KeyRound className="h-5 w-5" />
            </div>
            <DialogTitle>Cliente criado!</DialogTitle>
            <DialogDescription>
              Copie a senha temporária e envie via WhatsApp para{" "}
              <strong className="text-foreground">{createdResult.name}</strong>{" "}
              ({createdResult.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-background/60 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Senha temporária
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-lg tracking-wider">
                {createdResult.tempPassword}
              </code>
              <Button type="button" size="sm" variant="gold" onClick={copyPassword}>
                <Copy className="h-4 w-4" />
                Copiar
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              No primeiro login o cliente será obrigado a trocar essa senha por
              uma própria. Esta senha continua visível no painel admin enquanto
              não for trocada.
            </p>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={resetAndClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-navy">
            <UserPlus className="h-5 w-5" />
          </div>
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription>
            Crie um novo cliente manualmente. Uma senha temporária será gerada e
            mostrada aqui pra você enviar via WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo *</Label>
            <Input
              id="fullName"
              required
              autoFocus
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Ex: Maria Silva e Família"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="cliente@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+5511999999999"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Etapa atual</Label>
              <select
                id="stage"
                value={form.currentStage}
                onChange={(e) =>
                  setForm({ ...form, currentStage: e.target.value as Stage })
                }
                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {(["sv", "croqui", "holding"] as Stage[]).map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clickupTaskId">
              ID da tarefa no ClickUp{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="clickupTaskId"
              value={form.clickupTaskId}
              onChange={(e) =>
                setForm({ ...form, clickupTaskId: e.target.value })
              }
              placeholder="Ex: 86agppnx1"
            />
            <p className="text-xs text-muted-foreground">
              Cole o ID da tarefa-âncora deste cliente no ClickUp pra habilitar
              sincronização das fases da Holding e dados de reunião.
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando…
                </>
              ) : (
                "Criar cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
