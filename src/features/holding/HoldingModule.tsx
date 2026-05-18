import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { useAuth } from "@/contexts/AuthContext";
import { HoldingPhasesView } from "./HoldingPhasesView";

export default function HoldingModule() {
  const { user } = useAuth();
  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 3"
        title="Holding Familiar"
        description="Acompanhe abaixo o passo-a-passo da constituição da sua holding, com status e previsões atualizadas em tempo real."
      />
      <HoldingPhasesView
        clientId={user?.clientId ?? null}
        emptyMessage="Sua holding ainda não começou. Assim que nossa equipe iniciar a execução, as etapas e tarefas aparecerão aqui."
      />
    </>
  );
}
