import { and, desc, eq, inArray } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

const columns = {
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
        orderBy: desc(gamesTable.modifiedAt),
        limit,
      }
    }

    const backlogQuery = () => {
      return {
        columns,
        where: and(
          eq(gamesTable.userId, userId),
          inArray(gamesTable.status, ["Backlog", "Replay"]),
        ),
        orderBy: desc(gamesTable.modifiedAt),
        limit,
      }
    }

    const backlog = await db.query.gamesTable.findMany(backlogQuery())
    const playing = await db.query.gamesTable.findMany(defaultQuery("Playing"))
    const finished = await db.query.gamesTable.findMany(
      defaultQuery("Finished"),
    )

    return ok({ backlog, playing, finished })
  }
}
