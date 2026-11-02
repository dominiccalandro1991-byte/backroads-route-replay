import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BackRoads — Rural routes & original music" },
      { name: "description", content: "Share backroad conditions, drop pins on scenic lookouts and ride along to original tracks." },
      { property: "og:title", content: "BackRoads — Rural routes & original music" },
      { property: "og:description", content: "Share backroad conditions, drop pins and ride along to original tracks." },
    ],
  }),
  beforeLoad: () => { throw redirect({ to: "/feed" }); },
});
