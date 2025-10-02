import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { gamesTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { ok } from "../utils/http"

export class DeleteGameByIdController {
  static async handle({ userId, params }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const game = await db.query.gamesTable.findFirst({
      columns: { id: true, name: true, platform: true, rating: true, platinum: true, finishedAt: true, createdAt: true },
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId)
      )
    })

    if (!game) {
      throw new Error("Game ID not found")
    }

    await db.delete(gamesTable).where(and(
      eq(gamesTable.id, params.gameId),
      eq(gamesTable.userId, userId),
    ))

    return ok({ message: "Game deleted." })
  }
}