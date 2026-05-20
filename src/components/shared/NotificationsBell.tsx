/**
 * Sininho de notificações pro admin.
 *
 * Hoje mostra: pedidos de redefinição de senha.
 * No futuro: outros tipos de alerta.
 *
 * Polling automático a cada 30s.
 * Badge vermelho com contador quando há notificações pendentes.
 */
import { Bell, KeyRound, MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminNotifications } from "@/lib/notifications";

interface NotificationsBellProps {
  /** Quando o admin clica em uma notificação de cliente, abre o detalhe dele. */
  onOpenClient?: (clientId: string) => void;
}

function formatTimeAgo(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d atrás`;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function NotificationsBell({ onOpenClient }: NotificationsBellProps) {
  const [open, setOpen] = useState(false);
  const { notifications, loading } = useAdminNotifications(true);
  const count = notifications.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Notificações (${count})`}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Bell className="h-5 w-5" />
            </div>
            <DialogTitle>
              Notificações
              {count > 0 && (
                <Badge variant="warn" className="ml-2 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {count}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Pedidos e alertas que precisam de atenção
            </DialogDescription>
          </DialogHeader>

          {loading && notifications.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Carregando…
            </p>
          )}

          {!loading && notifications.length === 0 && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bell className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação pendente. Tudo em dia!
              </p>
            </div>
          )}

          {notifications.length > 0 && (
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <Card
                  key={n.id}
                  className="cursor-pointer transition hover:border-accent/40 hover:shadow-card-soft"
                  onClick={() => {
                    onOpenClient?.(n.clientId);
                    setOpen(false);
                  }}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{n.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {n.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTimeAgo(n.createdAt)}
                        {n.clientWhatsapp && (
                          <>
                            {" · "}
                            <MessageCircle className="ml-0.5 inline h-3 w-3" />{" "}
                            {n.clientWhatsapp}
                          </>
                        )}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      Abrir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
