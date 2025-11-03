import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { DatabaseError, ValidationError } from "../errors/AppError"
import { gameSchema } from "../schemas/gameSchema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { created } from "../utils/http"

export class AddGameController {
  static async handle({
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()
    const { success, error, data } = gameSchema.safeParse(body)

    if (!success) {
      throw new ValidationError('Invalid game data', error.issues)
    }

    try {
      await db.insert(gamesTable).values({
        userId,
        igdbId: String(data.igdbId),
        name: data.name,
        cover: data.cover,
        platforms: data.platforms,
        selectedPlatform: data.selectedPlatform,
        rating: data.rating,
        platinum: data.platinum,
        status: data.status,
        finishedAt: data.finishedAt,
      })
    } catch (error) {
      throw new DatabaseError('Failed to add game', error)
    }
    return created({ message: "Game added!" })
  }
}
