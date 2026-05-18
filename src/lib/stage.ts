/**
 * Hook pra info da etapa (SV ou Croqui) — vinda do ClickUp via backend.
 */
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export interface MeetingInfo {
  title: string;
  date: string; // ISO
  link: string | null;
  address: string | null;
  type: string | null;
}

export interface StageInfo {
  taskId: string;
  taskName: string;
  status: string;
  meeting: MeetingInfo | null;
  driveUrl: string | null;
}

interface ApiResponse {
  stageInfo: StageInfo | null;
  error?: string;
}

export function useStageInfo(
  clientId: string | null | undefined,
  stage: "sv" | "croqui",
) {
  const [info, setInfo] = useState<StageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setInfo(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get<ApiResponse>(`/api/clients/${clientId}/stage-info/${stage}`)
      .then((data) => {
        if (cancelled) return;
        setInfo(data.stageInfo);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Falha ao carregar");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, stage]);

  return { info, loading, error };
}
