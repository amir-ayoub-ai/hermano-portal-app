import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  status?: "current" | "completed" | "locked";
}

export function ModuleHeader({
  eyebrow,
  title,
  description,
  status,
}: ModuleHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <Button variant="ghost" size="sm" asChild className="-ml-3 mb-3">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        </div>
        {status === "current" && (
          <Badge variant="gold">Em andamento</Badge>
        )}
        {status === "completed" && (
          <Badge variant="success">Concluída</Badge>
        )}
      </div>
    </div>
  );
}
