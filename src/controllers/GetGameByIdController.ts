import { and, eq } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { notFound, ok } from "../utils/http"

export class ListGameByIdController {
  static async handle({
    userId,
    params,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()

    const game = await db.query.gamesTable.findFirst({
      columns: {
        id: true,
        name: true,
        cover: true,
        platforms: true,
        selectedPlatform: true,
        rating: true,
        status: true,
        platinum: true,
        completedAt: true,
        createdAt: true,
      },
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId),
      ),
    })

    if (!game) {
      return notFound({ error: "Game not found." })
    }

    return ok({ game })
  }
}
