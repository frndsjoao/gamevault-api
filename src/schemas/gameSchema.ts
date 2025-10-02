import { Platforms } from "../types/Platforms";
import z from "zod";

export const gameSchema = z.object({
  name: z.string({ error: "Name are required." }).min(1, { error: "Invalid name." }),
  platform: z.enum(Platforms).optional(),
  rating: z
    .union([
      z.number()
        .min(0, { message: "Rating must be at least 0" })
        .max(5, { message: "Rating must be at most 5" })
        .refine(
          (v) => Number.isFinite(v) && Number.isInteger(v * 2),
          { message: "Rating must be a multiple of 0.5" }
        ),
      z.null()
    ])
    .optional(),
  platinum: z.boolean().optional()
})

export const signUpschema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  birthDate: z.iso.date(),
  preferredPlatform: z.enum(Platforms)
})

export const signInschema = z.object({
  email: z.email(),
  password: z.string().min(8),
})