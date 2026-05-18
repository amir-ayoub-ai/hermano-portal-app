import { useAuth } from "@/contexts/AuthContext";
import { ALL_MODULES, MODULES, STAGE_ORDER } from "@/types/domain";
import { ModuleCard } from "./ModuleCard";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function HomeScreen() {
  const { user } = useAuth();
  const currentStage = user?.currentStage;

  const stageIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;
  const overallProgress =
    stageIndex >= 0 ? ((stageIndex + 1) / STAGE_ORDER.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section className="animate-fade-in">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Bem-vindo de volta
        </p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">
          Olá,{" "}
          <span className="gold-gradient-text">
            {user?.fullName.split(" ")[0]}
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Acompanhe abaixo o andamento do seu planejamento patrimonial. Cada
          etapa é desbloqueada conforme avançamos juntos no seu projeto.
        </p>
      </section>

      {/* Progress overview */}
      <Card className="border-accent/20 bg-gradient-to-br from-card to-card/40">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-navy shadow-gold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-lg">
                Etapa atual:{" "}
                <span className="text-accent">
                  {currentStage ? MODULES[currentStage].title : "—"}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.max(0, stageIndex + 1)} de {STAGE_ORDER.length} etapas avançadas
              </p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Progresso da jornada</span>
              <span className="font-medium text-foreground">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} />
          </div>
        </CardContent>
      </Card>

      {/* Modules grid — 3 etapas + SAHF (independente) */}
      <section>
        <h2 className="mb-4 font-serif text-xl">Sua jornada</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ALL_MODULES.map((id) => (
            <ModuleCard key={id} moduleId={id} user={user} />
          ))}
        </div>
      </section>
    </div>
  );
}
