/**
 * Input de senha com botão de mostrar/ocultar (olhinho).
 *
 * Suporta o mesmo ícone à esquerda (Lock por padrão) e o botão de visibilidade
 * à direita. Type alterna entre "password" e "text" conforme o estado.
 */
import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Ícone à esquerda. Default: cadeado. Passe null pra ocultar. */
  leftIcon?: React.ReactNode | null;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, leftIcon, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const showLeftIcon = leftIcon !== null;

  return (
    <div className="relative">
      {showLeftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leftIcon ?? <Lock className="h-4 w-4" />}
        </span>
      )}
      <Input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(showLeftIcon && "pl-9", "pr-10", className)}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
