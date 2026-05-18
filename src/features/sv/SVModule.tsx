import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useStageInfo } from "@/lib/stage";
import { StageDetailView } from "./StageDetailView";

export default function SVModule() {
  const { user } = useAuth();
  const { info, loading, error } = useStageInfo(user?.clientId, "sv");

  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 1"
        title="Sessão de Viabilidade"
        description="Diagnóstico inicial do seu cenário patrimonial e familiar. Avaliamos a viabilidade jurídica e estratégica do planejamento patrimonial."
      />
      <StageDetailView stage="sv" info={info} loading={loading} error={error} />
    </>
  );
}
