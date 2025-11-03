import { HttpResponse, ProtectedIGDBHttpRequest } from "../types/Http"
import { ok } from "../utils/http"
import { searchGameQuerySchema } from "../schemas/gameSchema"
import { getGameSearchByName } from "../services/igdb"
import { getTwitchValidToken } from "../domain/getTwitchValidToken"
import { GameIGDBResponse } from "../types/GameIGDBResponse"
import {
  getPlatformIdsString,
  normalizePlatforms,
} from "../lib/handlePlatforms"
import { ValidationError } from "../errors/AppError"

export class SearchGameController {
  static async handle({
    queryParams,
    userId,
  }: ProtectedIGDBHttpRequest): Promise<HttpResponse> {
    const { success, error, data } =
      searchGameQuerySchema.safeParse(queryParams)

    if (!success) {
      throw new ValidationError("Invalid search parameters", error.issues)
    }

    const twitchToken = await getTwitchValidToken(userId)
    const platforms = getPlatformIdsString(data.platform || "all")

    const searchQuery = `search "${data.search}";`
    const whereQuery = `where game_type=(0,8,9) & platforms=${platforms};`
    const fieldQuery =
      "fields id, name, platforms.name, cover.image_id, release_dates.y, release_dates.platform, release_dates.human;"
    const limitQuery = "limit 30;"

    const games = await getGameSearchByName({
      accessToken: twitchToken,
      clientId: process.env.TWITCH_CLIENT_ID!,
      query: `${searchQuery} ${whereQuery} ${fieldQuery} ${limitQuery}`,
    })

    const formattedGames = games
      .map((g: GameIGDBResponse) => {
        const cover = g.cover?.image_id
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${g.cover.image_id}.jpg`
          : null
        const normalizedPlatforms = normalizePlatforms(
          g.platforms || [],
          g.release_dates || [],
        )

        return { id: g.id, name: g.name, cover, platforms: normalizedPlatforms }
      })
      .filter((game: GameIGDBResponse) => game.platforms.length > 0)

    return ok({ games: formattedGames })
  }
}
