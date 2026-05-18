import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MOCK_PHASES, type Phase, type PhaseTask } from "@/lib/mockData";

const STATUS_LABEL: Record<PhaseTask["status"], string> = {
  pending: "Pendente",
  "in-progress": "Em andamento",
  completed: "Concluída",
};

function StatusIcon({ status }: { status: PhaseTask["status"] }) {
  if (status === "completed")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "in-progress")
    return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
  return <Circle className="h-4 w-4 text-muted-foreground" />;
}

function PhaseCard({ phase }: { phase: Phase }) {
  return (
    <Card
      className={
        phase.status === "in-progress"
          ? "border-accent/40 shadow-gold"
          : ""
      }
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{phase.name}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {phase.tasks.length} tarefas ·{" "}
              {phase.tasks.filter((t) => t.status === "completed").length}{" "}
              concluídas
            </p>
          </div>
          {phase.status === "completed" && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Concluída
            </Badge>
          )}
          {phase.status === "in-progress" && (
            <Badge variant="gold" className="gap-1">
              <Clock className="h-3 w-3" />
              Em andamento
            </Badge>
          )}
          {phase.status === "pending" && (
            <Badge variant="muted">Aguardando</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span className="font-medium text-foreground">
              {phase.progress}%
            </span>
          </div>
          <Progress value={phase.progress} />
        </div>

        <div className="space-y-2 border-t border-border/40 pt-3">
          {phase.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={task.status} />
                <span
                  className={
                    task.status === "completed"
                      ? "text-muted-foreground line-through"
                      : ""
                  }
                >
                  {task.name}
                </span>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {STATUS_LABEL[task.status]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HoldingModule() {
  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 3"
        title="Holding Familiar"
        description="Estruturação e constituição da sua holding familiar. Acompanhe abaixo o passo-a-passo e o status de cada etapa em tempo real."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {MOCK_PHASES.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
    </>
  );
}
