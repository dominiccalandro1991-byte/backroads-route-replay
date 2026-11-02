import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/compose")({
  head: () => ({
    meta: [
      { title: "Drop a Route — BackRoads" },
      { name: "description", content: "Post a route with field notes, coordinates, a photo and a soundtrack." },
      { property: "og:title", content: "Drop a Route — BackRoads" },
      { property: "og:description", content: "Post a route with notes, coordinates, a photo and a soundtrack." },
    ],
  }),
  component: Compose,
});

function Compose() {
  const { setComposerOpen } = useApp();
  useEffect(() => setComposerOpen(true), [setComposerOpen]);
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl font-extrabold uppercase">Drop a <span className="text-primary">Route</span></h1>
      <p className="mt-2 text-muted-foreground">The composer is open. Closed it? </p>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setComposerOpen(true)} className="tap rounded-md bg-primary px-5 font-semibold text-primary-foreground">Open composer</button>
        <Link to="/feed" className="tap flex items-center rounded-md border border-border px-5">Back to feed</Link>
      </div>
    </div>
  );
}
