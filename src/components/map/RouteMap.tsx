import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Waypoint } from "@/lib/data";

maplibregl.setWorkerUrl(workerUrl);

export default function RouteMap({ points, onSelect }: { points: Waypoint[]; onSelect: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const cb = useRef(onSelect);
  cb.current = onSelect;

  useEffect(() => {
    if (!el.current) return;
    const map = new maplibregl.Map({
      container: el.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      center: [-96, 37.5],
      zoom: 3.4,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.addSource("wp", {
        type: "geojson",
        cluster: true,
        clusterRadius: 50,
        data: {
          type: "FeatureCollection",
          features: points.map((p) => ({ type: "Feature", properties: { id: p.id, kind: p.kind }, geometry: { type: "Point", coordinates: [p.lng, p.lat] } })),
        },
      });
      map.addLayer({ id: "clusters", type: "circle", source: "wp", filter: ["has", "point_count"], paint: { "circle-color": "#f59e0b", "circle-opacity": 0.85, "circle-radius": ["step", ["get", "point_count"], 18, 4, 24], "circle-stroke-width": 3, "circle-stroke-color": "#020617" } });
      map.addLayer({ id: "count", type: "symbol", source: "wp", filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 13, "text-font": ["Noto Sans Bold"] }, paint: { "text-color": "#020617" } });
      map.addLayer({
        id: "pts", type: "circle", source: "wp", filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 9,
          "circle-color": ["match", ["get", "kind"], "Lookout", "#059669", "Geologic", "#94a3b8", "#f59e0b"],
          "circle-stroke-width": 3, "circle-stroke-color": "#020617",
        },
      });
      map.on("click", "clusters", async (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const src = map.getSource("wp") as maplibregl.GeoJSONSource;
        const z = await src.getClusterExpansionZoom(f.properties.cluster_id);
        map.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom: z });
      });
      map.on("click", "pts", (e) => {
        const f = e.features?.[0];
        if (f) { cb.current(f.properties.id); map.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom: Math.max(map.getZoom(), 8) }); }
      });
      for (const l of ["clusters", "pts"]) {
        map.on("mouseenter", l, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", l, () => (map.getCanvas().style.cursor = ""));
      }
    });
    return () => map.remove();
  }, [points]);

  return <div ref={el} className="h-full w-full" role="application" aria-label="Map of route waypoints" />;
}
