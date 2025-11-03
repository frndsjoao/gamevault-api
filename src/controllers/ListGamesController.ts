import { and, desc, eq, inArray } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"
import { GameStatusType } from "../types/GameStatus"

export class ListGamesController {
  static async handle({
    userId,
    page = 1,
    filter,
  }: ProtectedHttpRequest & {
    page?: number
    filter?: GameStatusType
  }): Promise<HttpResponse> {
    const db = getDb()

    const limit = 50
    const offset = (page - 1) * limit
    const conditions = [eq(gamesTable.userId, userId)]

    if (filter) {
      if (filter === "Backlog") {
        conditions.push(inArray(gamesTable.status, ["Backlog", "Replay"]))
      } else {
        conditions.push(eq(gamesTable.status, filter))
      }
    }

    const games = await db.query.gamesTable.findMany({
      columns: {
        id: true,
        igdbId: true,
        name: true,
        cover: true,
        platforms: true,
        selectedPlatform: true,
        rating: true,
        status: true,
        platinum: true,
        finishedAt: true,
      },
      where: and(...conditions),
      orderBy: desc(gamesTable.modifiedAt),
      limit,
      offset,
    })

    return ok({ games, page, pageSize: limit })
  }
}
