import {
  CheckCircle2,
  ClipboardList,
  Download,
  Calendar,
  FileText,
} from "lucide-react";
import { ModuleHeader } from "@/components/shared/ModuleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const checklist = [
  { label: "Cadastro inicial preenchido", done: true },
  { label: "Documentos pessoais enviados", done: true },
  { label: "Inventário patrimonial preliminar", done: true },
  { label: "Reunião de apresentação realizada", done: true },
  { label: "Relatório de viabilidade entregue", done: true },
];

export default function SVModule() {
  return (
    <>
      <ModuleHeader
        eyebrow="Etapa 1"
        title="Sessão de Viabilidade"
        description="Diagnóstico inicial do seu cenário patrimonial e familiar. Avaliamos a viabilidade jurídica e estratégica do planejamento patrimonial."
        status="completed"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="h-5 w-5 text-accent" />
              Checklist da etapa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 px-4 py-3"
              >
                <CheckCircle2
                  className={
                    item.done
                      ? "h-5 w-5 text-emerald-500"
                      : "h-5 w-5 text-muted-foreground"
                  }
                />
                <span
                  className={
                    item.done
                      ? "text-sm text-foreground"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próxima reunião</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Apresentação do Croqui</p>
                  <p className="text-sm text-muted-foreground">
                    14 de maio · 14h00
                  </p>
                  <Badge variant="muted" className="mt-2">
                    Online
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentos da etapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Relatório de Viabilidade.pdf",
                "Diagnóstico Patrimonial.pdf",
              ].map((doc) => (
                <Button
                  key={doc}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="truncate">{doc}</span>
                  </span>
                  <Download className="h-4 w-4" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
