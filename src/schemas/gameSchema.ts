import { Platforms } from "../types/Platforms";
import z from "zod";

export const gameSchema = z.object({
  name: z.string({ error: "Name are required." }).min(1, { error: "Invalid name." }),
  platform: z.enum(Platforms).optional(),
  rating: z.number().min(0, { message: "Rating must be at least 0" }).max(5, { message: "Rating must be at most 5" }).refine((v) => Number.isFinite(v) && Number.isInteger(v * 2), { message: "Rating must be a multiple of 0.5", }).optional(),
  platinum: z.boolean().optional()
})