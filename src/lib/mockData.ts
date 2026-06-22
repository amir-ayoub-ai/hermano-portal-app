import type { Client, User } from "@/types/domain";

export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "u-admin",
    email: "hermano@hermanocorradi.com.br",
    password: "admin123",
    fullName: "Dr. Hermano Corradi",
    role: "admin",
  },
  {
    id: "c-1",
    email: "cliente@exemplo.com",
    password: "cliente123",
    fullName: "Roberto Silveira",
    role: "client",
    currentStage: "croqui",
    hasSahf: false,
  },
  {
    id: "c-2",
    email: "ana@exemplo.com",
    password: "cliente123",
    fullName: "Ana Beatriz Mendes",
    role: "client",
    currentStage: "sv",
    hasSahf: false,
  },
  {
    id: "c-3",
    email: "ricardo@exemplo.com",
    password: "cliente123",
    fullName: "Ricardo Almeida",
    role: "client",
    currentStage: "holding",
    hasSahf: true,
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: "c-1",
    fullName: "Roberto Silveira",
    email: "cliente@exemplo.com",
    currentStage: "croqui",
    hasSahf: false,
    createdAt: "2026-02-12",
  },
  {
    id: "c-2",
    fullName: "Ana Beatriz Mendes",
    email: "ana@exemplo.com",
    currentStage: "sv",
    hasSahf: false,
    createdAt: "2026-04-03",
  },
  {
    id: "c-3",
    fullName: "Ricardo Almeida",
    email: "ricardo@exemplo.com",
    currentStage: "holding",
    hasSahf: true,
    createdAt: "2025-09-21",
  },
  {
    id: "c-4",
    fullName: "Família Tavares",
    email: "tavares@exemplo.com",
    currentStage: "holding",
    hasSahf: false,
    createdAt: "2026-01-08",
  },
];

export interface PhaseTask {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
  responsible?: string;
}

export interface Phase {
  id: string;
  name: string;
  progress: number; // 0-100
  status: "pending" | "in-progress" | "completed";
  tasks: PhaseTask[];
}

export const MOCK_PHASES: Phase[] = [
  {
    id: "p1",
    name: "Sessão de Viabilidade",
    progress: 100,
    status: "completed",
    tasks: [
      { id: "t1", name: "Coleta de documentos", status: "completed", responsible: "Equipe Hermano Corradi" },
      { id: "t2", name: "Análise patrimonial inicial", status: "completed", responsible: "Dr. Hermano Corradi" },
      { id: "t3", name: "Reunião de apresentação", status: "completed", responsible: "Dr. Hermano Corradi" },
    ],
  },
  {
    id: "p2",
    name: "Projeto Estrutural",
    progress: 60,
    status: "in-progress",
    tasks: [
      { id: "t4", name: "Levantamento de bens", status: "completed", responsible: "Equipe Hermano Corradi" },
      { id: "t5", name: "Mapeamento societário", status: "in-progress", responsible: "Dra. Mariana" },
      { id: "t6", name: "Aprovação do croqui", status: "pending" },
    ],
  },
  {
    id: "p3",
    name: "Holding Familiar",
    progress: 0,
    status: "pending",
    tasks: [
      { id: "t7", name: "Constituição da holding", status: "pending" },
      { id: "t8", name: "Integralização de bens", status: "pending" },
      { id: "t9", name: "Registros legais", status: "pending" },
    ],
  },
  {
    id: "p4",
    name: "SAHF — Acompanhamento",
    progress: 0,
    status: "pending",
    tasks: [
      { id: "t10", name: "Onboarding SAHF", status: "pending" },
      { id: "t11", name: "Primeiro relatório trimestral", status: "pending" },
    ],
  },
];
