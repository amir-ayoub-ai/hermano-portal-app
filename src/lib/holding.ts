/**
 * Hook pra buscar as fases reais da Holding (vindas do ClickUp via backend).
 */
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export type RemoteTaskStatus =
  | "pending"
  | "in_progress"
  | "in_review"
  | "in_approval"
  | "completed"
  | "blocked";

export interface RemoteSubtask {
  id: string;
  name: string;
  status: RemoteTaskStatus;
  statusLabel: string;
  isBlocked: boolean;
  progress: number;
  estimatedDate: string | null;
}

export interface RemotePhase {
  id: string;
  name: string;
  status: RemoteTaskStatus;
  statusLabel: string;
  progress: number;
  isBlocked: boolean;
  estimatedDate: string | null;
  subtasks: RemoteSubtask[];
}

interface ApiResponse {
  phases: RemotePhase[];
  message?: string;
  error?: string;
}

export function useHoldingPhases(clientId: string | null | undefined) {
  const [phases, setPhases] = useState<RemotePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setPhases([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setMessage(null);

    api
      .get<ApiResponse>(`/api/clients/${clientId}/holding-phases`)
      .then((data) => {
        if (cancelled) return;
        setPhases(data.phases ?? []);
        setMessage(data.message ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError) setError(err.message);
        else setError("Falha ao buscar fases");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return { phases, loading, error, message };
}
