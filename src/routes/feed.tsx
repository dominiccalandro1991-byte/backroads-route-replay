import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/feed/PostCard";
import { useApp } from "@/lib/store";
import type { Difficulty } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — BackRoads" },
      { name: "description", content: "Field reports from rural routes: road conditions, coordinates and the soundtrack that rode along." },
      { property: "og:title", content: "Feed — BackRoads" },
      { property: "og:description", content: "Field reports from rural routes with road conditions and soundtracks." },
    ],
  }),
  component: Feed,
});

type Sort = "recent" | "proximity";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={cn("tap shrink-0 rounded-full border px-4 text-sm", active ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground")}>{children}</button>
  );
}

function Feed() {
  const { posts } = useApp();
  const [sort, setSort] = useState<Sort>("recent");
  const [diff, setDiff] = useState<Difficulty | "All">("All");
  const [withTrack, setWithTrack] = useState(false);

  const list = useMemo(() => {
    let l = posts.filter((p) => (diff === "All" || p.difficulty === diff) && (!withTrack || p.trackId));
    l = [...l].sort((a, b) => (sort === "recent" ? +new Date(b.createdAt) - +new Date(a.createdAt) : a.distanceMi - b.distanceMi));
    return l;
  }, [posts, sort, diff, withTrack]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-display text-4xl font-extrabold uppercase">Route <span className="text-primary">Reports</span></h1>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2" role="toolbar" aria-label="Feed filters">
        <Chip active={sort === "recent"} onClick={() => setSort("recent")}>Recent</Chip>
        <Chip active={sort === "proximity"} onClick={() => setSort("proximity")}>Nearest</Chip>
        <span className="w-px shrink-0 bg-border" />
        {(["All", "Easy", "Moderate", "Rough"] as const).map((d) => <Chip key={d} active={diff === d} onClick={() => setDiff(d)}>{d}</Chip>)}
        <span className="w-px shrink-0 bg-border" />
        <Chip active={withTrack} onClick={() => setWithTrack(!withTrack)}>With track</Chip>
      </div>
      <div className="mt-4 space-y-5">
        {list.map((p) => <PostCard key={p.id} post={p} />)}
        {list.length === 0 && <p className="py-10 text-center text-muted-foreground">No routes match those filters.</p>}
      </div>
    </div>
  );
}
