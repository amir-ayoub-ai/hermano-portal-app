/**
 * Hook que busca notificações do admin (atualmente: pedidos de reset de senha).
 * Faz polling a cada 30s pra detectar novas notificações sem precisar reload.
 */
import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export interface AdminNotification {
  id: string;
  type: "password_reset_requested";
  title: string;
  message: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string | null;
  createdAt: string;
}

interface NotificationsResponse {
  total: number;
  notifications: AdminNotification[];
}

const POLL_INTERVAL_MS = 30_000;

export function useAdminNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await api.get<NotificationsResponse>(
        "/api/admin/notifications",
      );
      setNotifications(data.notifications);
    } catch (err) {
      // 401/403 são esperados se o user perdeu permissão; não polui o console
      if (!(err instanceof ApiError && (err.status === 401 || err.status === 403))) {
        console.warn("[notifications] falha:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    void fetchNotifications();
    const id = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, fetchNotifications]);

  return { notifications, loading, refresh: fetchNotifications };
}
