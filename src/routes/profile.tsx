import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Pause, Play } from "lucide-react";
import { Tracklist } from "@/components/audio/Tracklist";
import { PostCard } from "@/components/feed/PostCard";
import { fmtCount, images, tracks, userByHandle, users } from "@/lib/data";
import { useApp, usePlayer } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  validateSearch: (s: Record<string, unknown>) => ({ u: typeof s.u === "string" ? s.u : undefined }),
  head: () => ({
    meta: [
      { title: "Artist Profile — BackRoads" },
      { name: "description", content: "Artist bios, release catalogs and pinned tracks from BackRoads musicians." },
      { property: "og:title", content: "Artist Profile — BackRoads" },
      { property: "og:description", content: "Artist bios, release catalogs and pinned tracks." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { u } = Route.useSearch();
  const user = userByHandle(u ?? "") ?? users[0];
  const catalog = tracks.filter((t) => t.artist === user.name);
  const pinned = catalog[0];
  const p = usePlayer();
  const { posts } = useApp();
  const mine = posts.filter((x) => x.userId === user.id);
  const playing = pinned && p.track?.id === pinned.id && p.playing;

  return (
    <div>
      <div className="relative">
        <img src={images.banner} alt="" width={1600} height={640} className="h-48 w-full object-cover md:h-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="mx-auto -mt-16 max-w-4xl px-4">
        <div className="relative flex items-end gap-4">
          <div className="glow grid size-24 shrink-0 place-items-center rounded-xl border-4 border-background bg-muted font-display text-4xl font-extrabold text-primary">{user.initials}</div>
          <div className="pb-1">
            <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold uppercase md:text-5xl">{user.name}{user.verified && <BadgeCheck className="size-6 text-primary" aria-label="Verified" />}</h1>
            <p className="text-sm text-muted-foreground">@{user.handle}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Artists">
          {users.slice(0, 2).map((a) => (
            <Link key={a.id} to="/profile" search={{ u: a.handle }} className={cn("tap flex items-center rounded-full border px-4 text-sm", a.id === user.id ? "border-primary text-primary" : "border-border text-muted-foreground")}>{a.name}</Link>
          ))}
        </div>
        {user.bio && <p className="mt-4 max-w-xl text-lg">{user.bio}</p>}

        {pinned && (
          <section className="mt-6 flex items-center gap-4 rounded-xl border border-primary/40 bg-card p-4" aria-label="Pinned track">
            <button onClick={() => p.play(pinned)} className="tap glow grid size-14 place-items-center rounded-full bg-primary text-primary-foreground" aria-label={`${playing ? "Pause" : "Play"} ${pinned.title}`}>
              {playing ? <Pause /> : <Play />}
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Pinned track</p>
              <p className="truncate font-display text-2xl font-bold uppercase">{pinned.title}</p>
              <p className="text-xs text-muted-foreground">{pinned.genre} · {fmtCount(pinned.plays)} plays</p>
            </div>
          </section>
        )}

        <h2 className="mt-8 mb-2 font-display text-2xl font-bold uppercase">Release Catalog</h2>
        {catalog.length ? <Tracklist items={catalog} /> : <p className="text-muted-foreground">No releases yet.</p>}

        <h2 className="mt-8 mb-3 font-display text-2xl font-bold uppercase">Routes</h2>
        <div className="space-y-5 pb-6">{mine.map((x) => <PostCard key={x.id} post={x} />)}</div>
      </div>
    </div>
  );
}
