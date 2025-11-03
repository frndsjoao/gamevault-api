import { and, eq } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../errors/AppError"
import { gameSchema } from "../schemas/gameSchema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

export class UpdateGameByIdController {
  static async handle({
    userId,
    body,
    params,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()
    const { success, error, data } = gameSchema.safeParse(body)

    if (!success) {
      throw new ValidationError("Invalid game data", error.issues)
    }

    const game = await db.query.gamesTable.findFirst({
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId),
      ),
    })

    if (!game) {
      throw new NotFoundError("Game")
    }

    try {
      await db
        .update(gamesTable)
        .set({
          ...data,
          igdbId: String(data.igdbId),
          modifiedAt: new Date(),
        })
        .where(eq(gamesTable.id, params.gameId))
    } catch (error) {
      throw new DatabaseError("Failed to update game", error)
    }

    return ok({ message: "Game updated!" })
  }
}
