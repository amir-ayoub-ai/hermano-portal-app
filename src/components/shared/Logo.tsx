import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import hrzLight from "@/assets/logos/hrz_light@20x.png";
import hrzDark from "@/assets/logos/hrz_dark@20x.png";
import icoLight from "@/assets/logos/ico_light@20x.png";
import icoDark from "@/assets/logos/ico_dark@20x.png";
import vrtLight from "@/assets/logos/vrt_light@20x.png";
import vrtDark from "@/assets/logos/vrt_dark@20x.png";

type Variant = "horizontal" | "icon" | "vertical";

interface LogoProps {
  variant?: Variant;
  className?: string;
  /** Force a fixed variant regardless of theme. */
  fixed?: "light" | "dark";
}

export function Logo({ variant = "horizontal", className, fixed }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDarkBg = fixed ? fixed === "dark" : resolvedTheme === "dark";

  // Os arquivos "*_dark" são desenhados em dourado claro (para fundo escuro).
  // Os arquivos "*_light" são desenhados em cores escuras (para fundo claro).
  const map = {
    horizontal: { darkBg: hrzDark, lightBg: hrzLight },
    icon: { darkBg: icoDark, lightBg: icoLight },
    vertical: { darkBg: vrtDark, lightBg: vrtLight },
  } as const;

  const src = isDarkBg ? map[variant].darkBg : map[variant].lightBg;

  return (
    <img
      src={src}
      alt="Garcez Consultoria"
      className={cn("h-auto w-auto select-none", className)}
      draggable={false}
    />
  );
}
