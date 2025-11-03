import { ReleaseDatesIGDB } from "../types/GameIGDBResponse"
import { Platform } from "../types/Platforms"

type NormalizedPlatform = {
  id: string
  name: string
  releaseDate: number | string
}

export const Platforms = ["pc", "playstation", "xbox", "nintendo"]

export const PlatformsWithId = [
  { id: 6, name: "PC (Microsoft Windows)" },
  { id: 7, name: "PlayStation" },
  { id: 8, name: "PlayStation 2" },
  { id: 9, name: "PlayStation 3" },
  { id: 48, name: "PlayStation 4" },
  { id: 167, name: "PlayStation 5" },
  { id: 169, name: "Xbox Series X|S" },
  { id: 49, name: "Xbox One" },
  { id: 130, name: "Nintendo Switch" },
]

export function normalizePlatforms(
  platforms: Platform[],
  releaseDates: ReleaseDatesIGDB[],
): NormalizedPlatform[] {
  const merged: NormalizedPlatform[] = []

  if (!platforms || !releaseDates) return []

  for (const platform of platforms) {
    const releases = releaseDates.filter((r) => r.platform === platform.id)
    if (!releases.length) continue

    const latestRelease = releases.reduce((a, b) => {
      if (a.y && b.y) return a.y > b.y ? a : b
      if (a.y && !b.y) return a
      if (!a.y && b.y) return b
      return new Date(a.human) > new Date(b.human) ? a : b
    })

    const releaseValue = latestRelease.y ?? latestRelease.human
    merged.push({
      id: String(platform.id),
      name: platform.name,
      releaseDate: releaseValue,
    })
  }

  const map: Record<string, NormalizedPlatform> = {}

  for (const p of merged) {
    let normalizedName = ""

    if (p.name.includes("PlayStation")) normalizedName = "Playstation"
    else if (p.name.includes("Xbox")) normalizedName = "Xbox"
    else if (p.name.includes("Nintendo")) normalizedName = "Nintendo"
    else if (p.name.includes("PC")) normalizedName = "Pc"
    else if (p.name.includes("Mac")) normalizedName = "Pc"
    else continue

    const id = normalizedName.toLowerCase()
    const existing = map[id]

    if (
      !existing ||
      (typeof p.releaseDate === "number" &&
        (typeof existing.releaseDate !== "number" ||
          p.releaseDate > existing.releaseDate))
    ) {
      map[id] = { id, name: normalizedName, releaseDate: p.releaseDate }
    }
  }

  return Object.values(map)
}

const PLATFORM_GROUPS: Record<string, string[]> = {
  playstation: ["PlayStation"],
  xbox: ["Xbox"],
  nintendo: ["Nintendo"],
  pc: ["PC", "Mac"],
  all: [],
}

export function getPlatformIdsString(platform: string): string {
  const normalized = platform.toLowerCase()

  if (normalized === "all") {
    const allIds = PlatformsWithId.map((p) => p.id)
    return `(${allIds.join(", ")})`
  }

  const searchTerms = PLATFORM_GROUPS[normalized]
  if (!searchTerms) return "()"

  const ids = PlatformsWithId.filter((p) =>
    searchTerms.some((term) => p.name.includes(term)),
  ).map((p) => p.id)

  return ids.length ? `(${ids.join(", ")})` : "()"
}
