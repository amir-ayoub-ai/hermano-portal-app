import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useStageInfo } from "@/lib/stage";
import { StageDetailView } from "@/features/sv/StageDetailView";

export default function CroquiModule() {
  const { user } = useAuth();
  const { info, loading, error } = useStageInfo(user?.clientId, "croqui");

  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 2"
        title="Projeto Estrutural"
        description="Desenho da estrutura societária ideal para o seu patrimônio e família. Aqui você acompanha o croqui e a proposta da sua holding."
      />
      <StageDetailView
        stage="croqui"
        info={info}
        loading={loading}
        error={error}
      />
    </>
  );
}
