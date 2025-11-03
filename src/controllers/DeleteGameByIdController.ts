import { and, eq } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { DatabaseError, NotFoundError } from "../errors/AppError"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

export class DeleteGameByIdController {
  static async handle({
    userId,
    params,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()

    const game = await db.query.gamesTable.findFirst({
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId),
      ),
    })

    if (!game) {
      throw new NotFoundError('Game')
    }

    try {
      await db
        .delete(gamesTable)
        .where(
          and(eq(gamesTable.id, params.gameId), eq(gamesTable.userId, userId)),
        )
    } catch (err) {
      throw new DatabaseError('Failed to delete game', err)
    }

    return ok({ message: "Game deleted." })
  }
}
