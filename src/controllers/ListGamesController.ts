import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { gamesTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

export class ListGamesController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const games = await db.query.gamesTable.findMany({
      columns: { name: true, platform: true, rating: true, platinum: true },
      where: eq(gamesTable.userId, userId)
    })

    return ok({ games })
  }
}