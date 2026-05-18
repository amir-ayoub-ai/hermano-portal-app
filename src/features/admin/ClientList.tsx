import { ChevronRight, Crown } from "lucide-react";
import type { Client } from "@/types/domain";
import { MODULES } from "@/types/domain";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

interface ClientListProps {
  clients: Client[];
  onSelect: (client: Client) => void;
}

export function ClientList({ clients, onSelect }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          Nenhum cliente encontrado.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <Card
          key={c.id}
          className="cursor-pointer transition-all hover:border-accent/40 hover:shadow-card-soft"
          onClick={() => onSelect(c)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-11 w-11 border border-border">
              <AvatarFallback className="bg-gold-gradient font-semibold text-navy">
                {getInitials(c.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{c.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{c.email}</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Badge variant="gold">{MODULES[c.currentStage].title}</Badge>
              {c.hasSahf && (
                <Badge variant="gold" className="gap-1">
                  <Crown className="h-3 w-3" />
                  SAHF
                </Badge>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
