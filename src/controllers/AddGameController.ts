import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { gameSchema } from "../schemas/gameSchema"
import { parseSchemaErrors } from "../schemas/parseSchemaErrors"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { badRequest, created } from "../utils/http"

export class AddGameController {
  static async handle({
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()
    const { success, error } = gameSchema.safeParse(body)

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    try {
      await db.insert(gamesTable).values({
        userId,
        igdbId: body.igdbId,
        name: body.name,
        cover: body.cover,
        platforms: body.platforms,
        selectedPlatform: body.selectedPlatform,
        rating: body.rating,
        platinum: body.platinum,
        status: body.status,
        completedAt: body.completedAt,
      })
    } catch (error) {
      return badRequest({ error: "Something went wrong" })
    }
    return created({ message: "Game added!" })
  }
}
