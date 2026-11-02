import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/lib/store";
import { fmtTime } from "@/lib/data";

export function PlayerBar() {
  const p = usePlayer();
  const dur = p.duration || p.track?.duration || 0;
  return (
    <div className="glass fixed inset-x-0 bottom-16 z-40 border-x-0 md:bottom-0" role="region" aria-label="Audio player">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2">
        <div className="hidden min-w-0 flex-1 sm:block md:max-w-[220px]">
          <p className="truncate text-sm font-semibold">{p.track?.title ?? "Nothing playing"}</p>
          <p className="truncate text-xs text-muted-foreground">{p.track?.artist ?? "Pick a track to ride with"}</p>
        </div>
        <div className="flex items-center">
          <button className="tap grid place-items-center rounded-full text-muted-foreground hover:text-foreground" onClick={p.prev} aria-label="Previous track"><SkipBack className="size-4" /></button>
          <button className="tap glow grid place-items-center rounded-full bg-primary text-primary-foreground" onClick={p.toggle} aria-label={p.playing ? "Pause" : "Play"}>
            {p.playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
          </button>
          <button className="tap grid place-items-center rounded-full text-muted-foreground hover:text-foreground" onClick={p.next} aria-label="Next track"><SkipForward className="size-4" /></button>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{fmtTime(p.time)}</span>
          <Slider aria-label="Seek" value={[Math.min(p.time, dur)]} max={dur || 1} step={1} onValueChange={([v]) => p.seek(v ?? 0)} disabled={!p.track} />
          <span className="w-10 font-mono text-[11px] text-muted-foreground">{fmtTime(dur)}</span>
        </div>
        <div className="hidden w-32 items-center gap-2 md:flex">
          <button className="tap grid place-items-center text-muted-foreground" onClick={() => p.setVolume(p.volume ? 0 : 0.8)} aria-label={p.volume ? "Mute" : "Unmute"}>
            {p.volume ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
          <Slider aria-label="Volume" value={[p.volume]} max={1} step={0.01} onValueChange={([v]) => p.setVolume(v ?? 0)} />
        </div>
      </div>
    </div>
  );
}
