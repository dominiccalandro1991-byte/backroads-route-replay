import { useState } from "react";
import { LayoutGrid, List, Pause, Play, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fmtCount, fmtTime, type Track } from "@/lib/data";
import { useApp, usePlayer } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Tracklist({ items }: { items: Track[] }) {
  const [view, setView] = useState<"list" | "grid">("list");
  const p = usePlayer();
  const { openComposerWithTrack } = useApp();
  return (
    <div>
      <div className="mb-3 flex justify-end gap-1" role="group" aria-label="Tracklist view">
        {(["list", "grid"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} aria-pressed={view === v} aria-label={`${v} view`}
            className={cn("tap grid place-items-center rounded-md", view === v ? "bg-accent text-primary" : "text-muted-foreground")}>
            {v === "list" ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
          </button>
        ))}
      </div>
      <ul className={cn(view === "grid" ? "grid grid-cols-2 gap-3 md:grid-cols-3" : "divide-y divide-border rounded-xl border border-border bg-card")}>
        {items.map((t, i) => {
          const active = p.track?.id === t.id && p.playing;
          return (
            <li key={t.id} className={cn("flex gap-3", view === "grid" ? "flex-col rounded-xl border border-border bg-card p-3" : "items-center px-3 py-2")}>
              <button onClick={() => p.play(t)} aria-label={`${active ? "Pause" : "Play"} ${t.title}`}
                className={cn("tap grid shrink-0 place-items-center rounded-md", active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground", view === "grid" && "aspect-square w-full")}>
                {active ? <Pause className="size-5" /> : view === "list" ? <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span> : <Play className="size-6" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{t.title}</p>
                <p className="truncate text-xs text-muted-foreground">{t.artist} · {fmtCount(t.plays)} plays · {fmtTime(t.duration)}</p>
                <Badge variant="outline" className="mt-1 border-secondary/50 text-secondary">{t.genre}</Badge>
              </div>
              <button onClick={() => openComposerWithTrack(t.id)} aria-label={`Add ${t.title} to a post`}
                className="tap flex items-center justify-center gap-1 rounded-md px-2 text-xs text-primary hover:bg-accent">
                <Plus className="size-4" /> <span className={cn(view === "list" && "hidden sm:inline")}>Add to Post</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
