import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialPosts, tracks, type Post, type Track } from "./data";

interface PlayerState {
  track: Track | null;
  playing: boolean;
  time: number;
  duration: number;
  volume: number;
  play: (t: Track) => void;
  toggle: () => void;
  seek: (s: number) => void;
  setVolume: (v: number) => void;
  next: () => void;
  prev: () => void;
}

interface AppState {
  posts: Post[];
  addPost: (p: Post) => void;
  pinPost: (id: string) => void;
  pinned: Set<string>;
  addComment: (id: string, text: string) => void;
  composerOpen: boolean;
  setComposerOpen: (o: boolean) => void;
  composerTrack: string | undefined;
  openComposerWithTrack: (id?: string) => void;
}

const PlayerCtx = createContext<PlayerState | null>(null);
const AppCtx = createContext<AppState | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVol] = useState(0.8);

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    audio.current = a;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const play = useCallback((t: Track) => {
    const a = audio.current;
    if (!a) return;
    if (track?.id === t.id) {
      a.paused ? a.play().catch(() => {}) : a.pause();
      return;
    }
    a.src = t.src;
    setTrack(t);
    setTime(0);
    setDuration(t.duration);
    a.play().catch(() => setPlaying(false));
  }, [track]);

  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (!track) return play(tracks[0]!);
    a.paused ? a.play().catch(() => {}) : a.pause();
  }, [track, play]);

  const seek = (s: number) => { if (audio.current) audio.current.currentTime = s; setTime(s); };
  const setVolume = (v: number) => { if (audio.current) audio.current.volume = v; setVol(v); };
  const step = (d: number) => {
    const i = track ? tracks.findIndex((t) => t.id === track.id) : -1;
    play(tracks[(i + d + tracks.length) % tracks.length]!);
  };

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const onEnd = () => step(1);
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  });

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerTrack, setComposerTrack] = useState<string | undefined>();

  const app: AppState = {
    posts,
    addPost: (p) => setPosts((ps) => [p, ...ps]),
    pinned,
    pinPost: (id) => {
      const has = pinned.has(id);
      setPinned((s) => { const n = new Set(s); has ? n.delete(id) : n.add(id); return n; });
      setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, pins: p.pins + (has ? -1 : 1) } : p)));
    },
    addComment: (id, text) =>
      setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { user: "you", text }] } : p))),
    composerOpen,
    setComposerOpen,
    composerTrack,
    openComposerWithTrack: (id) => { setComposerTrack(id); setComposerOpen(true); },
  };

  return (
    <PlayerCtx.Provider value={{ track, playing, time, duration, volume, play, toggle, seek, setVolume, next: () => step(1), prev: () => step(-1) }}>
      <AppCtx.Provider value={app}>{children}</AppCtx.Provider>
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx)!;
export const useApp = () => useContext(AppCtx)!;
