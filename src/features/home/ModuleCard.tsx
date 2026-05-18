import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Lock,
  Sparkles,
} from "lucide-react";
import {
  isCurrent,
  isUnlocked,
  type ModuleId,
  type Stage,
  MODULES,
} from "@/types/domain";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ModuleCardProps {
  moduleId: ModuleId;
  user: { currentStage?: Stage; hasSahf?: boolean } | null | undefined;
}

export function ModuleCard({ moduleId, user }: ModuleCardProps) {
  const meta = MODULES[moduleId];
  const unlocked = isUnlocked(moduleId, user);
  const current = isCurrent(moduleId, user?.currentStage);
  const completed = unlocked && !current && moduleId !== "sahf";

  // SAHF tem tratamento especial de "teaser" quando bloqueado.
  if (moduleId === "sahf" && !unlocked) {
    return <SahfTeaserCard />;
  }

  const content = (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300",
        unlocked
          ? "border-border hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold cursor-pointer"
          : "border-dashed border-border/60 opacity-70",
      )}
    >
      {current && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-gradient opacity-20 blur-2xl" />
      )}

      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {meta.subtitle}
          </p>
          <h3 className="mt-1 font-serif text-xl tracking-tight">
            {meta.title}
          </h3>
        </div>

        {!unlocked && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
        )}
        {current && (
          <Badge variant="gold" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Em andamento
          </Badge>
        )}
        {completed && (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Concluída
          </Badge>
        )}
        {moduleId === "sahf" && unlocked && (
          <Badge variant="gold" className="gap-1">
            <Crown className="h-3 w-3" />
            Ativo
          </Badge>
        )}
      </div>

      <p className="mb-6 flex-1 text-sm text-muted-foreground">
        {meta.description}
      </p>

      <div className="flex items-center justify-between">
        {unlocked ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:translate-x-0.5 transition-transform">
            Acessar
            <ArrowRight className="h-4 w-4" />
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            Disponível após avançar nas etapas anteriores
          </span>
        )}
      </div>
    </div>
  );

  if (!unlocked) return <div aria-disabled>{content}</div>;

  return (
    <Link
      to={`/${moduleId}`}
      aria-label={`Acessar módulo ${meta.title}`}
      className="block h-full"
    >
      {content}
    </Link>
  );
}

/**
 * Card especial do SAHF quando o cliente NÃO contratou.
 * Cria um efeito de mistério/desejo: blur, brilho dourado, conteúdo "borrado"
 * e cadeado em destaque. SAHF é independente das etapas — sempre aparece assim
 * até que seja contratado.
 */
function SahfTeaserCard() {
  const meta = MODULES.sahf;
  return (
    <div
      role="button"
      aria-disabled
      title="SAHF — Acesso exclusivo"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-navy-gradient p-6 text-white transition-all duration-300 hover:border-gold/60 hover:shadow-gold cursor-pointer"
    >
      {/* Conteúdo "fantasma" borrado, sugerindo o que existe lá dentro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none p-6 opacity-30 blur-md"
      >
        <p className="font-mono text-xs uppercase tracking-widest">
          {meta.subtitle}
        </p>
        <h3 className="mt-1 font-serif text-xl">{meta.title}</h3>
        <div className="mt-6 space-y-2 text-sm">
          <p>● Documentos da Holding</p>
          <p>● Relatórios financeiros</p>
          <p>● Garcez Academy</p>
          <p>● Novidades e relatórios</p>
        </div>
      </div>

      {/* Brilho dourado animado */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-gradient opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

      {/* Camada de overlay com o cadeado em destaque */}
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-navy/60 shadow-gold backdrop-blur-sm">
          <Lock className="h-7 w-7 text-gold-light" />
        </div>
        <Badge
          variant="gold"
          className="mb-3 border-gold/40 bg-gold/15 text-gold-light"
        >
          <Crown className="h-3 w-3" />
          Acesso exclusivo
        </Badge>
        <h3 className="font-serif text-2xl tracking-tight gold-shimmer">
          SAHF
        </h3>
        <p className="mt-1 max-w-[18ch] text-sm text-white/70">
          Gestão de Legado Contínua para clientes do programa premium.
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-gold-light/90 group-hover:translate-x-0.5 transition-transform">
          Saber mais
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
