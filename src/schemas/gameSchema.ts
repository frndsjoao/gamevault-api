import { Platforms } from "../lib/handlePlatforms"
import { GameStatus } from "../types/GameStatus"
import z from "zod"

export const gameSchema = z.object({
  igdbId: z.string().min(1).or(z.number()),
  name: z.string().min(1),
  cover: z.string().nullable().optional(),
  platforms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      releaseDate: z.string().optional().or(z.number().optional()),
    }),
  ),
  selectedPlatform: z.enum(Platforms).optional(),
  status: z.enum(GameStatus),
  rating: z
    .union([
      z
        .number()
        .min(0, { message: "Rating must be at least 0" })
        .max(5, { message: "Rating must be at most 5" })
        .refine((v) => Number.isFinite(v) && Number.isInteger(v * 2), {
          message: "Rating must be a multiple of 0.5",
        }),
      z.null(),
    ])
    .optional(),
  platinum: z.boolean().optional(),
  finishedAt: z.iso.date().nullable().optional(),
})

export const signUpschema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  birthdate: z.iso.date(),
  preferredPlatform: z.enum(Platforms),
})

export const signInschema = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "Must have 8 characters" }),
})

export const searchGameQuerySchema = z.object({
  search: z.string().min(1),
  platform: z.string().nullable().optional(),
})
