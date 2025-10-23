import { and, desc, eq, ne } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

const columns = {
  platforms: true,
  name: true,
  selectedPlatform: true,
  rating: true,
  platinum: true,
  id: true,
  status: true,
  cover: true,
  completedAt: true,
}

export class GameDashboardController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()

    const limit = 15

    const defaultQuery = (status: string) => {
      return {
        columns,
        where: and(
          eq(gamesTable.userId, userId),
          eq(gamesTable.status, status),
        ),
        orderBy: desc(gamesTable.createdAt),
        limit,
      }
    }

    const backlog = await db.query.gamesTable.findMany(defaultQuery("Backlog"))
    const playing = await db.query.gamesTable.findMany(defaultQuery("Playing"))
    const completed = await db.query.gamesTable.findMany(
      defaultQuery("Completed"),
    )

    return ok({ backlog, playing, completed })
  }
}
