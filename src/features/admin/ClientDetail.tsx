import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Crown,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import type { Client, Stage } from "@/types/domain";
import { MODULES, STAGE_ORDER, isStageUnlocked } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";
import { regeneratePassword } from "@/lib/clients";
import { HoldingPhasesView } from "@/features/holding/HoldingPhasesView";
import { StageDetailView } from "@/features/sv/StageDetailView";
import { useStageInfo } from "@/lib/stage";

/**
 * Wrapper interno: roda o hook useStageInfo e renderiza StageDetailView.
 * Usado nas tabs do admin pra mostrar SV e Projeto Estrutural igual o cliente vê.
 */
function AdminStagePanel({
  clientId,
  stage,
}: {
  clientId: string;
  stage: "sv" | "croqui";
}) {
  const { info, loading, error } = useStageInfo(clientId, stage);
  return (
    <StageDetailView stage={stage} info={info} loading={loading} error={error} />
  );
}

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onStageChange: (stage: Stage) => void;
  onSahfChange: (hasSahf: boolean) => void;
  onPasswordRegenerated?: (tempPassword: string) => void;
}

export function ClientDetail({
  client,
  onBack,
  onStageChange,
  onSahfChange,
  onPasswordRegenerated,
}: ClientDetailProps) {
  const [regenerating, setRegenerating] = useState(false);

  async function copyPassword(pw: string) {
    try {
      await navigator.clipboard.writeText(pw);
      toast.success("Senha copiada — cole no WhatsApp do cliente.");
    } catch {
      toast.error("Não consegui copiar. Selecione o texto manualmente.");
    }
  }

  async function handleRegenerate() {
    if (
      !confirm(
        `Gerar uma nova senha temporária para ${client.fullName}? A senha atual deixará de funcionar.`,
      )
    )
      return;
    setRegenerating(true);
    try {
      const newPw = await regeneratePassword(client.id);
      onPasswordRegenerated?.(newPw);
      toast.success("Nova senha gerada. Não esqueça de enviar pro cliente.");
      await copyPassword(newPw);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar senha");
    } finally {
      setRegenerating(false);
    }
  }
  function advance() {
    const idx = STAGE_ORDER.indexOf(client.currentStage);
    if (idx >= STAGE_ORDER.length - 1) {
      toast.info("Cliente já está na última etapa da jornada.");
      return;
    }
    const next = STAGE_ORDER[idx + 1];
    onStageChange(next);
    toast.success(`${client.fullName} avançou para ${MODULES[next].title}.`);
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
        <ArrowLeft className="h-4 w-4" />
        Voltar para clientes
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-border">
              <AvatarFallback className="bg-gold-gradient text-base font-semibold text-navy">
                {getInitials(client.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-serif text-2xl">{client.fullName}</h2>
              <p className="text-sm text-muted-foreground">{client.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Cliente desde {client.createdAt}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">{MODULES[client.currentStage].title}</Badge>
              {client.hasSahf && (
                <Badge variant="gold" className="gap-1">
                  <Crown className="h-3 w-3" />
                  SAHF
                </Badge>
              )}
            </div>
            <Button variant="gold" size="sm" onClick={advance}>
              Avançar etapa
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="permissoes">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="sv">Sessão de Viabilidade</TabsTrigger>
          <TabsTrigger value="projeto">Projeto Estrutural</TabsTrigger>
          <TabsTrigger value="holding">Holding</TabsTrigger>
          <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
        </TabsList>

        <TabsContent value="permissoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Etapa da jornada</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecione a etapa em que o cliente se encontra. Todas as etapas
                anteriores ficam desbloqueadas automaticamente.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {STAGE_ORDER.map((id) => {
                  const unlocked = isStageUnlocked(id, client.currentStage);
                  const isCurrentStage = client.currentStage === id;
                  return (
                    <button
                      key={id}
                      onClick={() => onStageChange(id)}
                      className={
                        "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all " +
                        (isCurrentStage
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/40")
                      }
                    >
                      <div className="flex items-center gap-3">
                        {unlocked ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{MODULES[id].title}</p>
                          <p className="text-xs text-muted-foreground">
                            {MODULES[id].subtitle}
                          </p>
                        </div>
                      </div>
                      {isCurrentStage && (
                        <Badge variant="gold">Etapa atual</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Card de gestão de senha */}
          <Card
            className={
              client.passwordResetPending
                ? "border-amber-500/50 bg-amber-500/5"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="h-5 w-5 text-accent" />
                Acesso e senha
              </CardTitle>
              {client.passwordResetPending && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Cliente solicitou nova senha
                    </p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                      Gere abaixo uma nova senha temporária e envie via WhatsApp.
                    </p>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {client.pendingTempPassword ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Senha temporária pendente (cliente ainda não trocou)
                  </p>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 p-3">
                    <code className="flex-1 font-mono text-base tracking-wider">
                      {client.pendingTempPassword}
                    </code>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => copyPassword(client.pendingTempPassword!)}
                    >
                      <Copy className="h-4 w-4" />
                      Copiar
                    </Button>
                  </div>
                  {client.whatsapp && (
                    <p className="text-xs text-muted-foreground">
                      WhatsApp do cliente: <strong>{client.whatsapp}</strong>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Cliente já definiu uma senha pessoal.
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="w-full"
              >
                {regenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando…
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Gerar nova senha temporária
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-accent" />
                Acesso ao SAHF
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                O SAHF é um programa exclusivo, contratado separadamente. Ative
                aqui apenas para clientes que aderiram ao programa.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-4">
                <div>
                  <p className="font-medium">Programa SAHF ativo</p>
                  <p className="text-xs text-muted-foreground">
                    Libera Gestão de Legado Contínua para o cliente.
                  </p>
                </div>
                <Switch
                  checked={client.hasSahf}
                  onCheckedChange={(v) => {
                    onSahfChange(v);
                    toast.success(
                      v
                        ? "SAHF ativado para este cliente."
                        : "SAHF desativado.",
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sv">
          <AdminStagePanel clientId={client.id} stage="sv" />
        </TabsContent>

        <TabsContent value="projeto">
          <AdminStagePanel clientId={client.id} stage="croqui" />
        </TabsContent>

        <TabsContent value="holding">
          {client.currentStage === "holding" ? (
            <HoldingPhasesView
              clientId={client.id}
              emptyMessage="Este cliente ainda não tem tarefas de Execução da Holding criadas no ClickUp. Quando a equipe criar, aparecem aqui automaticamente."
            />
          ) : (
            <Card>
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                Fases da Holding aparecem aqui quando o cliente entrar nessa etapa
                (atualmente: <strong>{MODULES[client.currentStage].title}</strong>).
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="arquivos">
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              Documentos e arquivos compartilhados com o cliente.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
