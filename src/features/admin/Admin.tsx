import { useMemo, useState } from "react";
import { Loader2, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import type { Client } from "@/types/domain";
import { useClients } from "@/lib/clients";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientList } from "./ClientList";
import { ClientDetail } from "./ClientDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const { clients, loading, error, updateClient } = useClients();
  const [selected, setSelected] = useState<Client | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clients, query]);

  async function handleStageChange(clientId: string, stage: Client["currentStage"]) {
    try {
      const updated = await updateClient(clientId, { currentStage: stage });
      if (selected?.id === clientId) setSelected(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar cliente");
    }
  }

  async function handleSahfChange(clientId: string, hasSahf: boolean) {
    try {
      const updated = await updateClient(clientId, { hasSahf });
      if (selected?.id === clientId) setSelected(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar cliente");
    }
  }

  if (selected) {
    return (
      <ClientDetail
        client={selected}
        onBack={() => setSelected(null)}
        onStageChange={(stage) => handleStageChange(selected.id, stage)}
        onSahfChange={(v) => handleSahfChange(selected.id, v)}
        onPasswordRegenerated={(pw) => {
          setSelected({
            ...selected,
            pendingTempPassword: pw,
            mustChangePassword: true,
            passwordResetPending: false,
          });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Painel administrativo
          </p>
          <h1 className="mt-1 font-serif text-3xl">Clientes</h1>
        </div>
        <Button variant="gold" disabled>
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <Tabs defaultValue="clientes">
        <TabsList>
          <TabsTrigger value="clientes" className="gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-3 p-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando clientes…
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-10 text-center text-sm text-destructive">
                {error}
              </CardContent>
            </Card>
          ) : (
            <ClientList clients={filtered} onSelect={setSelected} />
          )}
        </TabsContent>

        <TabsContent value="conteudo">
          <Card>
            <CardContent className="p-10 text-center">
              <p className="font-serif text-xl">Conteúdo Geral</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Vídeos da Academy e novidades disponíveis para todos os clientes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
