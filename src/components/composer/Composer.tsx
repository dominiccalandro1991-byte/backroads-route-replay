import { useEffect, useState } from "react";
import { Check, Crosshair, ImagePlus, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SURFACES, routeStepSchema } from "@/lib/validation";
import { tracks, type Surface } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const steps = ["Route", "Media", "Soundtrack"];

export function Composer() {
  const { composerOpen, setComposerOpen, composerTrack, addPost } = useApp();
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [surface, setSurface] = useState<Surface | "">("");
  const [image, setImage] = useState<string | undefined>();
  const [stripped, setStripped] = useState(false);
  const [trackId, setTrackId] = useState<string | undefined>();
  const [drag, setDrag] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => { if (composerOpen) setTrackId(composerTrack); }, [composerOpen, composerTrack]);

  const parsed = routeStepSchema.safeParse({ text, lat: lat === "" ? undefined : lat, lng: lng === "" ? undefined : lng, surface: surface || undefined });
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
  const show = (k: string) => (touched || (k === "text" ? text : k === "lat" ? lat : k === "lng" ? lng : surface)) && errors[k];

  const reset = () => { setStep(0); setText(""); setLat(""); setLng(""); setSurface(""); setImage(undefined); setStripped(false); setTrackId(undefined); setTouched(false); };

  const gps = () => {
    if (!navigator.geolocation) { toast.error("GPS not available on this device"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude.toFixed(5)); setLng(pos.coords.longitude.toFixed(5)); toast.success("Coordinates filled from GPS"); },
      () => toast.error("Couldn't get your location"),
    );
  };

  const onFile = (f?: File) => {
    if (!f || !f.type.startsWith("image/")) { toast.error("Please drop an image file"); return; }
    setImage(URL.createObjectURL(f));
    setStripped(false);
    setTimeout(() => setStripped(true), 900);
  };

  const submit = () => {
    if (!parsed.success) { setStep(0); setTouched(true); return; }
    addPost({
      id: `p${Date.now()}`, userId: "u1", createdAt: new Date().toISOString(), text: parsed.data.text,
      lat: parsed.data.lat, lng: parsed.data.lng, surface: parsed.data.surface, difficulty: "Moderate",
      distanceMi: 0, image, trackId, pins: 0, comments: [],
    });
    toast.success("Route posted");
    setComposerOpen(false);
    reset();
  };

  return (
    <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase">Drop a Route</DialogTitle>
          <DialogDescription>Step {step + 1} of 3 · {steps[step]}</DialogDescription>
        </DialogHeader>
        <ol className="flex gap-2" aria-label="Progress">
          {steps.map((s, i) => (<li key={s} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} aria-current={i === step ? "step" : undefined}><span className="sr-only">{s}</span></li>))}
        </ol>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="text-sm font-semibold">Field notes</label>
              <textarea id="notes" value={text} onChange={(e) => setText(e.target.value)} rows={4} aria-invalid={!!show("text")} placeholder="What's the road like?" className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm" />
              <div className="flex justify-between text-xs"><span className="text-destructive">{show("text")}</span><span className="text-muted-foreground">{text.length}/500</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([["lat", "Latitude", lat, setLat], ["lng", "Longitude", lng, setLng]] as const).map(([k, l, v, set]) => (
                <div key={k}>
                  <label htmlFor={k} className="text-sm font-semibold">{l}</label>
                  <input id={k} inputMode="decimal" value={v} onChange={(e) => set(e.target.value)} aria-invalid={!!show(k)} className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3 font-mono text-sm" />
                  <p className="text-xs text-destructive">{show(k)}</p>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={gps} className="h-11 w-full"><Crosshair /> Use GPS</Button>
            <fieldset>
              <legend className="text-sm font-semibold">Surface condition</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SURFACES.map((s) => (
                  <button type="button" key={s} onClick={() => setSurface(s)} aria-pressed={surface === s} className={cn("tap rounded-md border text-sm", surface === s ? "border-primary bg-primary/15 text-primary" : "border-border")}>{s}</button>
                ))}
              </div>
              <p className="text-xs text-destructive">{show("surface")}</p>
            </fieldset>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {image ? (
              <div className="relative">
                <img src={image} alt="Attachment preview" className="aspect-[4/3] w-full rounded-lg object-cover" />
                <button onClick={() => { setImage(undefined); setStripped(false); }} aria-label="Remove image" className="tap absolute right-2 top-2 grid place-items-center rounded-full bg-background/80"><X className="size-4" /></button>
              </div>
            ) : (
              <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
                className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center", drag ? "border-primary bg-primary/10" : "border-border")}>
                <ImagePlus className="size-8 text-primary" />
                <span className="text-sm font-semibold">Drag a photo here or tap to choose</span>
                <span className="text-xs text-muted-foreground">Optional</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            )}
            {image && (
              <p role="status" className={cn("flex items-center gap-2 rounded-md border p-3 text-sm", stripped ? "border-secondary/50 text-secondary" : "border-border text-muted-foreground")}>
                <ShieldCheck className="size-4" /> {stripped ? "EXIF metadata stripped — your exact GPS & device info removed." : "Stripping EXIF metadata…"}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <ul className="space-y-2" role="radiogroup" aria-label="Soundtrack">
            <li><button role="radio" aria-checked={!trackId} onClick={() => setTrackId(undefined)} className={cn("tap w-full rounded-md border px-3 text-left text-sm", !trackId ? "border-primary text-primary" : "border-border")}>No soundtrack</button></li>
            {tracks.map((t) => (
              <li key={t.id}>
                <button role="radio" aria-checked={trackId === t.id} onClick={() => setTrackId(t.id)} className={cn("tap flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left", trackId === t.id ? "border-primary bg-primary/10" : "border-border")}>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{t.title}</span><span className="text-xs text-muted-foreground">{t.artist} · {t.genre}</span></span>
                  {trackId === t.id && <Check className="size-4 text-primary" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2 pt-2">
          {step > 0 && <Button variant="outline" className="h-11 flex-1" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 2 ? (
            <Button className="h-11 flex-1" onClick={() => { if (step === 0 && !parsed.success) return setTouched(true); setStep(step + 1); }}>Next</Button>
          ) : (
            <Button className="h-11 flex-1" onClick={submit}>Post route</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
