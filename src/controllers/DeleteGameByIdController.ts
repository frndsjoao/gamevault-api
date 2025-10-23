import { and, eq } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { badRequest, notFound, ok } from "../utils/http"

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
      return notFound({ error: "Game not found" })
    }

    try {
      await db
        .delete(gamesTable)
        .where(
          and(eq(gamesTable.id, params.gameId), eq(gamesTable.userId, userId)),
        )
    } catch (err) {
      return badRequest({ error: "Something went wrong." })
    }

    return ok({ message: "Game deleted." })
  }
}
