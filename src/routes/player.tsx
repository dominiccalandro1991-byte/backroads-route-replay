import { createFileRoute } from "@tanstack/react-router";
import { Tracklist } from "@/components/audio/Tracklist";
import { tracks } from "@/lib/data";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "Tracks — BackRoads" },
      { name: "description", content: "Original Country-Trap, Outlaw Country, Dark Synth-Rock and Alternative Rap from BackRoad Voltage and VAIL CIPHER." },
      { property: "og:title", content: "Tracks — BackRoads" },
      { property: "og:description", content: "Original tracks from BackRoad Voltage and VAIL CIPHER." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-2 font-display text-4xl font-extrabold uppercase">Road <span className="text-primary">Tracks</span></h1>
      <p className="mb-4 text-muted-foreground">Original music for long drives. Playback keeps going while you browse.</p>
      <Tracklist items={tracks} />
    </div>
  ),
});
