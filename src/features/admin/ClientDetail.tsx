import { ArrowLeft, CheckCircle2, Crown, Lock } from "lucide-react";
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

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onStageChange: (stage: Stage) => void;
  onSahfChange: (hasSahf: boolean) => void;
}

export function ClientDetail({
  client,
  onBack,
  onStageChange,
  onSahfChange,
}: ClientDetailProps) {
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
        <TabsList>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="progresso">Progresso (ClickUp)</TabsTrigger>
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

        <TabsContent value="progresso">
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              Acompanhe aqui o progresso detalhado das fases do cliente.
            </CardContent>
          </Card>
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
