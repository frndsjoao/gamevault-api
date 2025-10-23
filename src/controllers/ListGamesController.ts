import { and, desc, eq, ne } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

export class ListGamesController {
  static async handle({
    userId,
    page = 1,
    filter,
  }: ProtectedHttpRequest & {
    page?: number
    filter?: "backlog" | "notBacklog"
  }): Promise<HttpResponse> {
    const db = getDb()

    const limit = 50
    const offset = (page - 1) * limit
    const conditions = [eq(gamesTable.userId, userId)]

    if (filter === "backlog") {
      conditions.push(eq(gamesTable.status, "Backlog"))
    } else if (filter === "notBacklog") {
      conditions.push(ne(gamesTable.status, "Backlog"))
    }

    const games = await db.query.gamesTable.findMany({
      columns: {
        name: true,
        selectedPlatform: true,
        rating: true,
        platinum: true,
        id: true,
        status: true,
        cover: true,
        completedAt: true,
      },
      where: and(...conditions),
      orderBy: desc(gamesTable.createdAt),
      limit,
      offset,
    })

    return ok({ games, page, pageSize: limit })
  }
}
