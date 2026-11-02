import { z } from "zod";

export const SURFACES = ["Gravel", "Paved", "Seasonal", "Washboard"] as const;

export const routeStepSchema = z.object({
  text: z.string().trim().min(10, "Field notes need at least 10 characters").max(500, "Keep it under 500 characters"),
  lat: z.coerce.number({ message: "Latitude is required" }).min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  lng: z.coerce.number({ message: "Longitude is required" }).min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  surface: z.enum(SURFACES, { message: "Pick a surface condition" }),
});
