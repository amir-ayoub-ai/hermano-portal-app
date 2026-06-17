/**
 * Hook + funções pra gerenciar clientes via API.
 */
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Client, Stage } from "@/types/domain";

interface ApiClient {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  whatsapp: string | null;
  cpf: string | null;
  driveUrl: string | null;
  whatsappGroupUrl: string | null;
  currentStage: Stage;
  hasSahf: boolean;
  clickupTaskId: string | null;
  clickupListId: string | null;
  pendingTempPassword: string | null;
  mustChangePassword: boolean;
  passwordResetPending: boolean;
  passwordResetRequestedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function toClient(c: ApiClient): Client {
  return {
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    whatsapp: c.whatsapp ?? undefined,
    cpf: c.cpf ?? undefined,
    driveUrl: c.driveUrl ?? undefined,
    whatsappGroupUrl: c.whatsappGroupUrl ?? undefined,
    currentStage: c.currentStage,
    hasSahf: c.hasSahf,
    createdAt: c.createdAt.slice(0, 10),
    clickupTaskId: c.clickupTaskId ?? undefined,
    pendingTempPassword: c.pendingTempPassword ?? undefined,
    mustChangePassword: c.mustChangePassword,
    passwordResetPending: c.passwordResetPending,
    passwordResetRequestedAt: c.passwordResetRequestedAt ?? undefined,
  };
}

export async function regeneratePassword(clientId: string): Promise<string> {
  const res = await api.post<{ ok: boolean; tempPassword: string }>(
    `/api/clients/${clientId}/regenerate-password`,
  );
  return res.tempPassword;
}

export interface NewClientInput {
  fullName: string;
  email: string;
  whatsapp?: string;
  cpf?: string;
  driveUrl?: string;
  currentStage?: Stage;
  hasSahf?: boolean;
  clickupTaskId?: string;
}

export interface NewClientResult {
  client: Client;
  tempPassword?: string;
}

export async function createClient(
  input: NewClientInput,
): Promise<NewClientResult> {
  const res = await api.post<ApiClient & { tempPassword?: string }>(
    "/api/clients",
    input,
  );
  return {
    client: toClient(res),
    tempPassword: res.tempPassword,
  };
}

export async function deleteClient(clientId: string): Promise<void> {
  await api.delete(`/api/clients/${clientId}`);
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await api.get<ApiClient[]>("/api/clients");
      setClients(rows.map(toClient));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updateClient = useCallback(
    async (id: string, patch: Partial<Pick<Client, "currentStage" | "hasSahf" | "fullName">>) => {
      const updated = await api.patch<ApiClient>(`/api/clients/${id}`, patch);
      const mapped = toClient(updated);
      setClients((prev) => prev.map((c) => (c.id === id ? mapped : c)));
      return mapped;
    },
    [],
  );

  return { clients, loading, error, reload, updateClient };
}
