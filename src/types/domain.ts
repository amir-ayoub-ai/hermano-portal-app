export type Role = "admin" | "client";

/** Etapas obrigatórias da jornada, em ordem fixa. */
export type Stage = "sv" | "croqui" | "holding";
export const STAGE_ORDER: Stage[] = ["sv", "croqui", "holding"];

/** SAHF é um add-on independente, não uma etapa da jornada. */
export type ModuleId = Stage | "sahf";
export const ALL_MODULES: ModuleId[] = [...STAGE_ORDER, "sahf"];

export interface Client {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  currentStage: Stage;
  hasSahf: boolean;
  createdAt: string;
  clickupTaskId?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  currentStage?: Stage; // só para clientes
  hasSahf?: boolean;     // só para clientes — contratou o SAHF?
}

export interface ModuleMeta {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
}

export const MODULES: Record<ModuleId, ModuleMeta> = {
  sv: {
    id: "sv",
    title: "Sessão de Viabilidade",
    subtitle: "Etapa 1",
    description:
      "Diagnóstico inicial do seu cenário patrimonial e familiar.",
  },
  croqui: {
    id: "croqui",
    title: "Projeto Estrutural",
    subtitle: "Etapa 2",
    description:
      "Croqui e desenho da estrutura societária ideal para o seu patrimônio e família.",
  },
  holding: {
    id: "holding",
    title: "Holding Familiar",
    subtitle: "Etapa 3",
    description:
      "Estruturação e constituição da sua holding familiar.",
  },
  sahf: {
    id: "sahf",
    title: "SAHF",
    subtitle: "Acesso exclusivo",
    description:
      "Gestão de Legado Contínua — programa VIP de acompanhamento permanente da sua holding.",
  },
};

export function isStageUnlocked(
  moduleId: Stage,
  currentStage: Stage | undefined,
): boolean {
  if (!currentStage) return false;
  return STAGE_ORDER.indexOf(moduleId) <= STAGE_ORDER.indexOf(currentStage);
}

/**
 * Regras de desbloqueio:
 *  - SV / Projeto Estrutural / Holding → seguem a ordem da jornada (currentStage).
 *  - SAHF → independente. Só desbloqueia se o cliente contratou (hasSahf).
 */
export function isUnlocked(
  moduleId: ModuleId,
  user: { currentStage?: Stage; hasSahf?: boolean } | null | undefined,
): boolean {
  if (!user) return false;
  if (moduleId === "sahf") return user.hasSahf === true;
  return isStageUnlocked(moduleId, user.currentStage);
}

export function isCurrent(
  moduleId: ModuleId,
  currentStage: Stage | undefined,
): boolean {
  return currentStage === moduleId;
}
