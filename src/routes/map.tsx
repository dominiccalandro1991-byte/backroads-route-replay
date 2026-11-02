import { lazy, Suspense, useState } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Mountain, Music2, Pause, Play, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SurfaceTag } from "@/components/ui/surface-tag";
import { fmtCoord, trackById, waypoints } from "@/lib/data";
import { usePlayer } from "@/lib/store";

const RouteMap = lazy(() => import("@/components/map/RouteMap"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Route Map — BackRoads" },
      { name: "description", content: "Explore route drop points, geologic waypoints and scenic lookouts on an interactive map." },
      { property: "og:title", content: "Route Map — BackRoads" },
      { property: "og:description", content: "Drop points, geologic waypoints and scenic lookouts." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [sel, setSel] = useState<string | null>(null);
  const w = waypoints.find((x) => x.id === sel);
  const track = trackById(w?.trackId);
  const p = usePlayer();
  const playing = track && p.track?.id === track.id && p.playing;
  const fallback = <div className="grid h-full place-items-center text-muted-foreground">Loading map…</div>;

  return (
    <div className="relative h-[calc(100dvh-3.5rem-8.5rem)] md:h-[calc(100dvh-3.5rem-4rem)]">
      <ClientOnly fallback={fallback}>
        <Suspense fallback={fallback}><RouteMap points={waypoints} onSelect={setSel} /></Suspense>
      </ClientOnly>
      <div className="glass absolute left-3 top-3 flex gap-3 rounded-lg px-3 py-2 text-xs" aria-label="Legend">
        <span className="flex items-center gap-1"><i className="size-2.5 rounded-full bg-primary" />Drop Point</span>
        <span className="flex items-center gap-1"><i className="size-2.5 rounded-full bg-secondary" />Lookout</span>
        <span className="flex items-center gap-1"><i className="size-2.5 rounded-full bg-muted-foreground" />Geologic</span>
      </div>
      <Sheet open={!!w} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="overflow-y-auto">
          {w && (
            <>
              <SheetHeader>
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{w.kind}</p>
                <SheetTitle className="font-display text-3xl uppercase">{w.name}</SheetTitle>
                <SheetDescription className="font-mono">{fmtCoord(w.lat, w.lng)}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-muted p-3"><Mountain className="mb-1 size-4 text-secondary" /><p className="text-xs text-muted-foreground">Elevation</p><p className="font-mono text-lg">{w.elevationFt.toLocaleString()} ft</p></div>
                  <div className="rounded-lg border border-border bg-muted p-3"><p className="mb-2 text-xs text-muted-foreground">Surface</p><SurfaceTag surface={w.surface} /></div>
                </div>
                {w.image && <img src={w.image} alt={w.name} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />}
                {track && (
                  <button onClick={() => p.play(track)} className="tap flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left hover:border-primary/50" aria-label={`${playing ? "Pause" : "Play"} ${track.title}`}>
                    <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{track.title}</span><span className="text-xs text-muted-foreground">{track.artist}</span></span>
                    <Music2 className="size-4 text-secondary" />
                  </button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <span className="sr-only"><X /></span>
    </div>
  );
}
