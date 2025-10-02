import { desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { gamesTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

export class ListGamesController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const games = await db.query.gamesTable.findMany({
      columns: { name: true, platform: true, rating: true, platinum: true, id: true, status: true },
      where: eq(gamesTable.userId, userId),
      orderBy: desc(gamesTable.createdAt)
    })

    return ok({ games })
  }
}