import { useState } from "react";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Newspaper,
  Play,
  TrendingUp,
} from "lucide-react";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function SAHFModule() {
  const [tab, setTab] = useState("documentos");

  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 4 · SAHF"
        title="Gestão de Legado Contínua"
        description="Sistema de Acompanhamento da Holding Familiar — documentos, relatórios financeiros, novidades e a Garcez Academy, sempre à mão."
        status="current"
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="documentos" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Balanço
          </TabsTrigger>
          <TabsTrigger value="novidades" className="gap-2">
            <Newspaper className="h-4 w-4" />
            Novidades
          </TabsTrigger>
          <TabsTrigger value="academy" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Academy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <DocumentsView />
        </TabsContent>
        <TabsContent value="financeiro">
          <BalanceView />
        </TabsContent>
        <TabsContent value="novidades">
          <NewsView />
        </TabsContent>
        <TabsContent value="academy">
          <AcademyView />
        </TabsContent>
      </Tabs>
    </>
  );
}

function DocumentsView() {
  const folders = [
    { name: "Contrato Social", count: 4 },
    { name: "Atas e Alterações", count: 7 },
    { name: "Documentos Fiscais", count: 23 },
    { name: "Imóveis", count: 12 },
    { name: "Sucessão", count: 5 },
    { name: "Relatórios", count: 9 },
  ];

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Toda a documentação da sua holding organizada por categoria, sempre à mão.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((f) => (
          <Card
            key={f.name}
            className="cursor-pointer transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-soft"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-gradient text-navy">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">
                  {f.count} arquivos
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BalanceView() {
  const items = [
    { label: "Patrimônio total", value: "R$ 12.480.000", trend: "+4,2%" },
    { label: "Receitas (12m)", value: "R$ 1.260.000", trend: "+8,1%" },
    { label: "Despesas (12m)", value: "R$ 320.000", trend: "-2,0%" },
    { label: "Resultado líquido", value: "R$ 940.000", trend: "+12,4%" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {m.label}
              </p>
              <p className="mt-2 font-serif text-2xl">{m.value}</p>
              <Badge variant="success" className="mt-2">
                {m.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução patrimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex h-64 items-end gap-1.5 rounded-lg border border-border bg-muted/20 p-4">
            {[35, 42, 38, 50, 48, 55, 60, 58, 65, 70, 72, 80].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gold-gradient opacity-80 transition-opacity hover:opacity-100"
                style={{ height: `${h}%` }}
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NewsView() {
  const news = [
    {
      title: "Reforma tributária — o que muda para holdings em 2026",
      date: "02 mai · 5 min de leitura",
      tag: "Tributário",
    },
    {
      title: "Como blindar imóveis com cláusulas de incomunicabilidade",
      date: "28 abr · 7 min de leitura",
      tag: "Sucessão",
    },
    {
      title: "Novidades no SAHF: relatórios automáticos por e-mail",
      date: "20 abr · Atualização",
      tag: "Produto",
    },
  ];
  return (
    <div className="space-y-3">
      {news.map((n) => (
        <Card
          key={n.title}
          className="cursor-pointer transition-all hover:border-accent/40"
        >
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Newspaper className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge variant="muted" className="mb-1">
                {n.tag}
              </Badge>
              <p className="font-medium leading-snug">{n.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AcademyView() {
  const videos = [
    { title: "Boas-vindas à Garcez Academy", duration: "4:12" },
    { title: "Holding familiar: o que é e por que importa", duration: "12:30" },
    { title: "Estratégias de proteção patrimonial", duration: "18:05" },
    { title: "Sucessão sem inventário: passo-a-passo", duration: "15:40" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {videos.map((v) => (
        <Card
          key={v.title}
          className="cursor-pointer overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-gold"
        >
          <div className="relative flex aspect-video items-center justify-center bg-navy-gradient">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-navy shadow-gold">
              <Play className="h-6 w-6 fill-current" />
            </div>
            <Badge
              variant="muted"
              className="absolute bottom-3 right-3 bg-black/60 text-white"
            >
              {v.duration}
            </Badge>
          </div>
          <CardContent className="p-4">
            <p className="font-medium leading-snug">{v.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              Material de apoio disponível
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
