import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Disc3, Map, Newspaper, Plus, User } from "lucide-react";
import { PlayerBar } from "@/components/audio/PlayerBar";
import { Composer } from "@/components/composer/Composer";
import { useApp } from "@/lib/store";

const nav = [
  { to: "/feed", label: "Feed", icon: Newspaper },
  { to: "/map", label: "Map", icon: Map },
  { to: "/player", label: "Tracks", icon: Disc3 },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { setComposerOpen } = useApp();
  return (
    <div className="min-h-screen pb-36 md:pb-20">
      <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <Link to="/feed" className="flex items-center gap-2 font-display text-2xl font-extrabold uppercase tracking-wide">
            <span className="hazard inline-block h-5 w-2 rounded-sm" aria-hidden />Back<span className="text-primary">Roads</span>
          </Link>
          <nav className="hidden flex-1 gap-1 md:flex" aria-label="Main">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="tap flex items-center gap-2 rounded-md px-3 text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary bg-accent" }}>
                <n.icon className="size-4" />{n.label}
              </Link>
            ))}
          </nav>
          <button onClick={() => setComposerOpen(true)} className="tap glow ml-auto flex items-center gap-1 rounded-md bg-primary px-4 text-sm font-bold uppercase text-primary-foreground" aria-label="Compose a new post">
            <Plus className="size-4" /><span className="hidden sm:inline">Drop Route</span>
          </button>
        </div>
      </header>
      <main>{children}</main>
      <PlayerBar />
      <nav className="glass fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-x-0 border-b-0 md:hidden" aria-label="Main mobile">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} className="flex flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground" activeProps={{ className: "text-primary" }}>
            <n.icon className="size-5" />{n.label}
          </Link>
        ))}
      </nav>
      <Composer />
    </div>
  );
}
