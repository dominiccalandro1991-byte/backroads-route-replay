import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import banner from "@/assets/banner.jpg";

export type Surface = "Gravel" | "Paved" | "Seasonal" | "Washboard";
export type Difficulty = "Easy" | "Moderate" | "Rough";
export type Genre = "Country-Trap" | "Outlaw Country" | "Dark Synth-Rock" | "Alternative Rap";

export interface User {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  initials: string;
  bio?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: "BackRoad Voltage" | "VAIL CIPHER";
  genre: Genre;
  plays: number;
  duration: number;
  src: string;
}

export interface Post {
  id: string;
  userId: string;
  createdAt: string;
  text: string;
  lat: number;
  lng: number;
  surface: Surface;
  difficulty: Difficulty;
  distanceMi: number;
  image?: string;
  trackId?: string;
  pins: number;
  comments: { user: string; text: string }[];
}

export interface Waypoint {
  id: string;
  name: string;
  kind: "Drop Point" | "Geologic" | "Lookout";
  lat: number;
  lng: number;
  elevationFt: number;
  surface: Surface;
  image?: string;
  trackId?: string;
}

export const images = { post1, post2, banner };

export const users: User[] = [
  { id: "u1", name: "BackRoad Voltage", handle: "backroadvoltage", verified: true, initials: "BV", bio: "Country-trap out of the Ozark hollers. Every song was written on a road with no name." },
  { id: "u2", name: "VAIL CIPHER", handle: "vailcipher", verified: true, initials: "VC", bio: "Dark synth-rock for 2am county lines." },
  { id: "u3", name: "Dusty Marlow", handle: "dustytracks", verified: false, initials: "DM" },
  { id: "u4", name: "June Oakes", handle: "juneoakes", verified: false, initials: "JO" },
];

const helix = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const tracks: Track[] = [
  { id: "t1", title: "Gravel & Gold Chains", artist: "BackRoad Voltage", genre: "Country-Trap", plays: 482_113, duration: 372, src: helix(1) },
  { id: "t2", title: "County Line Static", artist: "VAIL CIPHER", genre: "Dark Synth-Rock", plays: 219_870, duration: 425, src: helix(2) },
  { id: "t3", title: "Whiskey Wire", artist: "BackRoad Voltage", genre: "Outlaw Country", plays: 156_402, duration: 344, src: helix(3) },
  { id: "t4", title: "No Signal Psalm", artist: "VAIL CIPHER", genre: "Alternative Rap", plays: 98_311, duration: 302, src: helix(4) },
  { id: "t5", title: "Tailgate Thunder", artist: "BackRoad Voltage", genre: "Country-Trap", plays: 71_090, duration: 353, src: helix(5) },
  { id: "t6", title: "Chrome Cicadas", artist: "VAIL CIPHER", genre: "Dark Synth-Rock", plays: 64_550, duration: 391, src: helix(6) },
];

export const initialPosts: Post[] = [
  { id: "p1", userId: "u1", createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), text: "CR 412 is washboarded bad past the low-water crossing. Took it at 25 with the windows down and Gravel & Gold Chains on repeat.", lat: 36.1287, lng: -93.0711, surface: "Washboard", difficulty: "Moderate", distanceMi: 12, image: post1, trackId: "t1", pins: 214, comments: [{ user: "dustytracks", text: "Grader came through Tuesday, still rough?" }, { user: "juneoakes", text: "That sunset tho." }] },
  { id: "p2", userId: "u2", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), text: "Forest Road 1003 opens the seasonal gate at the ridge. Lookout at mile 9 is worth the climb.", lat: 39.6403, lng: -106.3742, surface: "Seasonal", difficulty: "Rough", distanceMi: 410, image: post2, trackId: "t2", pins: 389, comments: [] },
  { id: "p3", userId: "u3", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), text: "Fresh chip seal on Old Mill Rd. Smooth as glass, zero traffic. Perfect night drive.", lat: 35.9606, lng: -83.9207, surface: "Paved", difficulty: "Easy", distanceMi: 640, trackId: "t3", pins: 58, comments: [{ user: "backroadvoltage", text: "Adding this to the tour route." }] },
  { id: "p4", userId: "u4", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), text: "Gravel cutoff behind the grain elevator saves 20 minutes to the river. Watch the cattle guard.", lat: 36.3, lng: -92.6, surface: "Gravel", difficulty: "Easy", distanceMi: 34, pins: 97, comments: [] },
];

export const waypoints: Waypoint[] = [
  { id: "w1", name: "Low-Water Crossing", kind: "Drop Point", lat: 36.1287, lng: -93.0711, elevationFt: 1142, surface: "Washboard", image: post1, trackId: "t1" },
  { id: "w2", name: "Hawksbill Bluff", kind: "Lookout", lat: 36.02, lng: -93.3, elevationFt: 2240, surface: "Gravel", trackId: "t3" },
  { id: "w3", name: "Ridge Gate Overlook", kind: "Lookout", lat: 39.6403, lng: -106.3742, elevationFt: 10_412, surface: "Seasonal", image: post2, trackId: "t2" },
  { id: "w4", name: "Red Shale Cut", kind: "Geologic", lat: 39.5, lng: -106.1, elevationFt: 9_120, surface: "Gravel", trackId: "t6" },
  { id: "w5", name: "Old Mill Road", kind: "Drop Point", lat: 35.9606, lng: -83.9207, elevationFt: 936, surface: "Paved", trackId: "t5" },
  { id: "w6", name: "Limestone Narrows", kind: "Geologic", lat: 36.35, lng: -92.55, elevationFt: 820, surface: "Gravel", trackId: "t4" },
];

export const userById = (id: string) => users.find((u) => u.id === id)!;
export const userByHandle = (h: string) => users.find((u) => u.handle === h);
export const trackById = (id?: string) => tracks.find((t) => t.id === id);

export const fmtTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};
export const fmtCount = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;
export const fmtCoord = (lat: number, lng: number) =>
  `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"} ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? "E" : "W"}`;
