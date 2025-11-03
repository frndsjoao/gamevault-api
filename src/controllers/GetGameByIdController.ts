import { and, eq } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { NotFoundError } from "../errors/AppError"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

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
        finishedAt: true,
        createdAt: true,
      },
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId),
      ),
    })

    if (!game) {
      throw new NotFoundError('Game')
    }

    return ok({ game })
  }
}
