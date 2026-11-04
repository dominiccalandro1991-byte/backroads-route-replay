import { useState } from "react";
import { BadgeCheck, MapPin, MessageSquare, Music2, Pause, Play, Share2, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Link, useHydrated } from "@tanstack/react-router";
import { fmtCoord, trackById, userById, type Post } from "@/lib/data";
import { useApp, usePlayer } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SurfaceTag } from "@/components/ui/surface-tag";

export function PostCard({ post }: { post: Post }) {
  const u = userById(post.userId);
  const track = trackById(post.trackId);
  const { pinPost, pinned, addComment } = useApp();
  const p = usePlayer();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const isPinned = pinned.has(post.id);
  const playing = track && p.track?.id === track.id && p.playing;

  const share = async () => {
    const url = `${location.origin}/feed#${post.id}`;
    try { await navigator.clipboard.writeText(url); toast.success("Route link copied"); } catch { toast("Share link: " + url); }
  };

  return (
    <article id={post.id} className="overflow-hidden rounded-xl border border-border bg-card" aria-label={`Post by ${u.name}`}>
      <header className="flex items-center gap-3 p-4">
        <div className="grid size-11 place-items-center rounded-full bg-muted font-display text-lg font-bold text-primary">{u.initials}</div>
        <div className="min-w-0 flex-1">
          <Link to="/profile" search={{ u: u.handle }} className="flex items-center gap-1 font-semibold hover:text-primary">
            {u.name} {u.verified && <BadgeCheck className="size-4 text-primary" aria-label="Verified" />}
          </Link>
          <p className="text-xs text-muted-foreground">@{u.handle} · <span suppressHydrationWarning>{hydrated ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "\u00a0"}</span></p>
        </div>
        <SurfaceTag surface={post.surface} />
      </header>
      <p className="px-4 pb-3 leading-relaxed">{post.text}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 pb-3 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="size-3 text-secondary" />{fmtCoord(post.lat, post.lng)}</span>
        <span>{post.difficulty}</span><span>{post.distanceMi} mi away</span>
      </div>
      {post.image && <img src={post.image} alt="Route photo" loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />}
      {track && (
        <button onClick={() => p.play(track)} className="tap mx-4 mt-3 flex w-[calc(100%-2rem)] items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2 text-left hover:border-primary/50" aria-label={`${playing ? "Pause" : "Play"} ${track.title}`}>
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{track.title}</span><span className="block truncate text-xs text-muted-foreground">{track.artist}</span></span>
          <Music2 className="size-4 text-secondary" />
        </button>
      )}
      <footer className="mt-2 flex items-center border-t border-border px-2">
        <button onClick={() => pinPost(post.id)} aria-pressed={isPinned} aria-label="Route-pin this post" className={cn("tap flex items-center gap-1.5 px-3 text-sm", isPinned ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
          <Pin className={cn("size-4", isPinned && "fill-current")} /> {post.pins}
        </button>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Show comments" className="tap flex items-center gap-1.5 px-3 text-sm text-muted-foreground hover:text-foreground">
          <MessageSquare className="size-4" /> {post.comments.length}
        </button>
        <button onClick={share} aria-label="Share post" className="tap ml-auto flex items-center px-3 text-muted-foreground hover:text-foreground"><Share2 className="size-4" /></button>
      </footer>
      {open && (
        <div className="space-y-2 border-t border-border bg-muted/40 p-4">
          {post.comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
          {post.comments.map((c, i) => (<p key={i} className="text-sm"><span className="font-semibold text-primary">@{c.user}</span> {c.text}</p>))}
          <form className="flex gap-2 pt-1" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { addComment(post.id, draft.trim()); setDraft(""); } }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment" aria-label="Comment" className="h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm" />
            <button className="tap rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Post</button>
          </form>
        </div>
      )}
    </article>
  );
}
