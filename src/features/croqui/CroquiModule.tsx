import { Building2, Eye, GitBranch, Network, Users } from "lucide-react";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CroquiModule() {
  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 2"
        title="Projeto Estrutural"
        description="Desenho da estrutura societária ideal para o seu patrimônio e família. Aqui você acompanha o croqui e a proposta da sua holding."
        status="current"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Network className="h-5 w-5 text-accent" />
              Estrutura proposta
            </CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              Visualizar em tela cheia
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
              <GitBranch className="mx-auto h-12 w-12 text-accent/60" />
              <p className="mt-4 font-serif text-lg">
                Croqui em fase de elaboração
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Nossa equipe está construindo o desenho da sua estrutura societária.
                Você receberá um aviso assim que estiver pronto para revisão.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-accent" />
                Bens mapeados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { tipo: "Imóveis residenciais", qtd: 3 },
                { tipo: "Imóveis comerciais", qtd: 2 },
                { tipo: "Participações societárias", qtd: 4 },
                { tipo: "Ativos financeiros", qtd: 1 },
              ].map((b) => (
                <div
                  key={b.tipo}
                  className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0"
                >
                  <span className="text-sm">{b.tipo}</span>
                  <Badge variant="muted">{b.qtd}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-accent" />
                Sucessores envolvidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Maria Silveira (cônjuge)", "Pedro Silveira (filho)", "Camila Silveira (filha)"].map(
                (n) => (
                  <div
                    key={n}
                    className="rounded-lg border border-border/50 bg-background/40 px-4 py-2 text-sm"
                  >
                    {n}
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
