/**
 * View compartilhada por Sessão de Viabilidade (etapa SV) e
 * Projeto Estrutural (etapa Croqui).
 *
 * Mostra 2 blocos:
 *   - Checklist da etapa (status visual baseado no status atual no ClickUp)
 *   - Reunião marcada (com título grande, data + horário, CTA dourado)
 */
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  Loader2,
  MapPin,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { StageInfo } from "@/lib/stage";

interface ChecklistItem {
  label: string;
  done: boolean;
}

/** Constrói o checklist pra uma etapa a partir do status atual no ClickUp. */
function buildChecklist(
  stage: "sv" | "croqui",
  status: string | undefined,
): ChecklistItem[] {
  const s = (status ?? "").toLowerCase();

  if (stage === "sv") {
    // Ordem real do funil de SV
    const steps = [
      "aguardando agendamento",
      "reunião agendada",
      "followup",
      "croqui fechado",
    ];
    const idx = steps.findIndex((step) => s.includes(step));
    return [
      { label: "Cadastro recebido", done: idx >= 0 },
      { label: "Sessão de Viabilidade agendada", done: idx >= 1 || s === "no-show" },
      { label: "Reunião realizada", done: idx >= 2 || s === "croqui fechado" },
      { label: "Croqui fechado — pronto pra próxima etapa", done: s === "croqui fechado" },
    ];
  }

  // croqui — funil do Projeto Estrutural
  const steps = [
    "aguardando pagamento",
    "apresentação agendada",
    "follow up",
    "negócio fechado",
  ];
  const idx = steps.findIndex((step) => s.includes(step));
  return [
    { label: "Croqui em elaboração pela equipe", done: idx >= 0 },
    { label: "Apresentação do Projeto Estrutural agendada", done: idx >= 1 },
    { label: "Pagamento do projeto confirmado", done: idx >= 2 || s.includes("sinal") },
    { label: "Negócio fechado — Holding pode ser iniciada", done: s.includes("negócio fechado") || s.includes("negocio fechado") },
  ];
}

interface StageDetailViewProps {
  stage: "sv" | "croqui";
  info: StageInfo | null;
  loading: boolean;
  error: string | null;
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function StageDetailView({
  stage,
  info,
  loading,
  error,
}: StageDetailViewProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-3 p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando…
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  // Se não há info do ClickUp mas o cliente já passou dessa etapa (caso
  // de clientes antigos), considera tudo concluído.
  const fallbackAllDone = !info;
  const checklist = fallbackAllDone
    ? buildChecklist(stage, stage === "sv" ? "croqui fechado" : "negócio fechado")
    : buildChecklist(stage, info?.status);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardList className="h-5 w-5 text-accent" />
            Checklist da etapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 px-4 py-3"
            >
              {item.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span
                className={
                  item.done
                    ? "text-sm text-foreground"
                    : "text-sm text-muted-foreground"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
          {info?.status && (
            <p className="pt-2 text-xs text-muted-foreground">
              Status no nosso sistema:{" "}
              <span className="font-medium text-foreground">{info.status}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reunião marcada — card grande, fonte destacada, CTA dourado */}
      <Card
        className={
          info?.meeting
            ? "border-accent/30 bg-gradient-to-br from-card to-card/40"
            : ""
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarClock className="h-5 w-5 text-accent" />
            Reunião marcada
          </CardTitle>
        </CardHeader>
        <CardContent>
          {info?.meeting ? (
            <div className="space-y-6">
              <div>
                <p className="font-serif text-2xl tracking-tight">
                  {info.meeting.title}
                </p>
                <p className="mt-2 text-base text-muted-foreground">
                  {formatDateTime(info.meeting.date)}
                </p>
              </div>

              {info.meeting.link && (
                <Button
                  asChild
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  <a
                    href={info.meeting.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Video className="h-5 w-5" />
                    Acessar reunião online
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              )}

              {info.meeting.address && (
                <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/40 p-4 text-sm">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{info.meeting.address}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="py-6 text-base text-muted-foreground">
              Sem reunião agendada no momento. Nossa equipe entrará em contato
              em breve pra marcar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
