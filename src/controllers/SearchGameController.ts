import { HttpResponse, ProtectedIGDBHttpRequest } from "../types/Http"
import { badRequest, ok } from "../utils/http"
import { getTwitchToken } from "../services/twitchAuth";
import { getGameSearchByName } from "../services/Igdb";
import { searchGameQuerySchema } from "../schemas/gameSchema";
import { parseSchemaErrors } from "../schemas/parseSchemaErrors";

export class SearchGameController {
  static async handle({ accessToken, body }: ProtectedIGDBHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = searchGameQuerySchema.safeParse(body)
    let newAccessToken = accessToken

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    if (!accessToken) {
      const tokenResponse = await getTwitchToken()
      newAccessToken = tokenResponse.access_token
    }

    const games = await getGameSearchByName({
      accessToken: newAccessToken,
      clientId: process.env.TWITCH_CLIENT_ID!,
      query: data.query
    })

    return ok({ games })
  }
}