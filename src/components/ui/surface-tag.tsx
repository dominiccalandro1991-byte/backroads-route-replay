import { cn } from "@/lib/utils";
import type { Surface } from "@/lib/data";

const styles: Record<Surface, string> = {
  Gravel: "border-primary/50 text-primary",
  Paved: "border-secondary/50 text-secondary",
  Seasonal: "border-destructive/50 text-destructive",
  Washboard: "border-muted-foreground/50 text-muted-foreground",
};

export function SurfaceTag({ surface, className }: { surface: Surface; className?: string }) {
  return (
    <span className={cn("rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", styles[surface], className)}>
      {surface}
    </span>
  );
}
