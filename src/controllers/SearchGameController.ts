import { HttpResponse, ProtectedIGDBHttpRequest } from "../types/Http"
import { badRequest, ok } from "../utils/http"
import { searchGameQuerySchema } from "../schemas/gameSchema";
import { parseSchemaErrors } from "../schemas/parseSchemaErrors";
import { getGameSearchByName } from "../services/igdb";
import { getTwitchValidToken } from "../domain/getTwitchValidToken";

export class SearchGameController {
  static async handle({ queryParams, userId }: ProtectedIGDBHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = searchGameQuerySchema.safeParse(queryParams)

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    const twitchToken = await getTwitchValidToken(userId)
    let baseQuery = `search "${data.search}"; fields id, name, slug, platforms.name, cover.image_id; limit 30;`

    if (data.platform) {
      baseQuery = `search "${data.search}"; where platforms = (${data.platform}); fields id, name, slug, platforms.name, cover.image_id; limit 30;`
    }

    const games = await getGameSearchByName({
      accessToken: twitchToken,
      clientId: process.env.TWITCH_CLIENT_ID!,
      query: baseQuery
    })

    const formattedGames = games.map((g: { cover?: { image_id: any; }; }) => {
      return {
        ...g,
        cover: g.cover?.image_id
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg`
          : null
      }
    })

    return ok({ games: formattedGames })
  }
}