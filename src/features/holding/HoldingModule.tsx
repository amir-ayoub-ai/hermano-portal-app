import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Eye,
  Loader2,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  useHoldingPhases,
  type RemotePhase,
  type RemoteTaskStatus,
} from "@/lib/holding";

const STATUS_LABEL: Record<RemoteTaskStatus, string> = {
  pending: "Aguardando",
  in_progress: "Em andamento",
  in_review: "Em revisão",
  in_approval: "Em aprovação",
  completed: "Concluída",
  blocked: "Travada",
};

function StatusIcon({ status }: { status: RemoteTaskStatus }) {
  if (status === "completed")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "blocked")
    return <AlertTriangle className="h-4 w-4 text-rose-500" />;
  if (status === "in_approval")
    return <ThumbsUp className="h-4 w-4 text-amber-500" />;
  if (status === "in_review")
    return <Eye className="h-4 w-4 text-blue-500" />;
  if (status === "in_progress")
    return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function StatusBadge({ status }: { status: RemoteTaskStatus }) {
  const cfg: Record<RemoteTaskStatus, { variant: "muted" | "gold" | "success" | "warn"; cls?: string; icon?: typeof Clock }> = {
    pending:     { variant: "muted" },
    in_progress: { variant: "gold", icon: Clock },
    in_review:   { variant: "warn", cls: "bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-400", icon: Eye },
    in_approval: { variant: "warn", icon: ThumbsUp },
    completed:   { variant: "success", icon: CheckCircle2 },
    blocked:     { variant: "warn", cls: "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 font-semibold", icon: AlertTriangle },
  };
  const c = cfg[status];
  const Icon = c.icon;
  return (
    <Badge variant={c.variant} className={cn("gap-1", c.cls)}>
      {Icon && <Icon className="h-3 w-3" />}
      {STATUS_LABEL[status]}
    </Badge>
  );
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function PhaseCard({ phase }: { phase: RemotePhase }) {
  const [open, setOpen] = useState(
    phase.status === "in_progress" ||
      phase.status === "blocked" ||
      phase.status === "in_review" ||
      phase.status === "in_approval",
  );
  const estimated = formatDate(phase.estimatedDate);

  return (
    <Card
      className={cn(
        phase.status === "in_progress" && "border-accent/40 shadow-gold",
        phase.status === "blocked" && "border-rose-500/40",
      )}
    >
      <CardHeader>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mx-2 -my-1 flex w-full items-start justify-between gap-3 rounded-lg px-2 py-1 text-left transition hover:bg-muted/30"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {open ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <CardTitle className="text-lg">{phase.name}</CardTitle>
            </div>
            <p className="mt-1 pl-6 text-xs text-muted-foreground">
              {phase.subtasks.length} tarefas ·{" "}
              {phase.subtasks.filter((t) => t.status === "completed").length}{" "}
              concluídas
              {estimated && (
                <>
                  {" · "}
                  <CalendarClock className="ml-1 inline h-3 w-3" /> previsão{" "}
                  {estimated}
                </>
              )}
            </p>
          </div>
          <StatusBadge status={phase.status} />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span
              className={cn(
                "font-medium text-foreground",
                phase.isBlocked && "text-rose-600 dark:text-rose-400",
              )}
            >
              {phase.progress}%
            </span>
          </div>
          <Progress
            value={phase.progress}
            className={
              phase.isBlocked
                ? "[&>div]:!bg-rose-500 [&>div]:!bg-none"
                : undefined
            }
          />
        </div>

        {open && phase.subtasks.length > 0 && (
          <div className="space-y-2 border-t border-border/40 pt-3">
            {phase.subtasks.map((task) => {
              const taskDate = formatDate(task.estimatedDate);
              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-md border bg-background/30 px-3 py-2 text-sm",
                    task.isBlocked
                      ? "border-rose-500/30 bg-rose-500/5"
                      : "border-border/40",
                  )}
                >
                  <div className="flex flex-1 items-start gap-2">
                    <StatusIcon status={task.status} />
                    <div className="flex-1">
                      <p
                        className={cn(
                          task.status === "completed" &&
                            "text-muted-foreground line-through",
                          task.isBlocked &&
                            "font-medium text-rose-700 dark:text-rose-400",
                        )}
                      >
                        {task.name}
                      </p>
                      {taskDate && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          previsão {taskDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="hidden text-xs sm:inline">
                    <StatusBadge status={task.status} />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HoldingModule() {
  const { user } = useAuth();
  const clientId = user?.clientId ?? null;
  const { phases, loading, error, message } = useHoldingPhases(clientId);

  const totalProgress =
    phases.length > 0
      ? Math.round(
          phases.reduce((sum, p) => sum + p.progress, 0) / phases.length,
        )
      : 0;
  const completedCount = phases.filter((p) => p.status === "completed").length;
  const blockedCount = phases.filter((p) => p.isBlocked).length;

  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 3"
        title="Holding Familiar"
        description="Acompanhe abaixo o passo-a-passo da constituição da sua holding, com status e previsões atualizadas em tempo real."
      />

      {phases.length > 0 && (
        <Card className="mb-6 border-accent/20 bg-gradient-to-br from-card to-card/40">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-navy shadow-gold">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="font-serif text-2xl">
                  Sua holding está{" "}
                  <span className="gold-gradient-text">{totalProgress}%</span>{" "}
                  concluída
                </p>
                <p className="text-sm text-muted-foreground">
                  {completedCount} de {phases.length} etapas finalizadas
                  {blockedCount > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      · <AlertTriangle className="h-3 w-3" />
                      {blockedCount} etapa{blockedCount > 1 ? "s" : ""} travada
                      {blockedCount > 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Progresso geral</span>
                <span className="font-medium text-foreground">
                  {totalProgress}%
                </span>
              </div>
              <Progress value={totalProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center gap-3 p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando suas fases…
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="p-8 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !error && phases.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-serif text-lg">Sua holding ainda não começou</p>
            <p className="max-w-md text-sm text-muted-foreground">
              {message ||
                "Assim que nossa equipe iniciar a execução da sua holding, as etapas e tarefas aparecerão aqui."}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && phases.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {phases.map((phase) => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </div>
      )}
    </>
  );
}
