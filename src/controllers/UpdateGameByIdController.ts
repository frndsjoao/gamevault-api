import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { gamesTable } from "../db/schema";
import { gameSchema } from "../schemas/gameSchema";
import { parseSchemaErrors } from "../schemas/parseSchemaErrors";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { badRequest, ok } from "../utils/http"

export class UpdateGameByIdController {
  static async handle({ userId, body, params }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const { success, error } = gameSchema.safeParse(body)

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    const game = await db.query.gamesTable.findFirst({
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId)
      )
    })

    if (!game) {
      throw new Error("Game ID not found")
    }

    await db.update(gamesTable).set({ ...body }).where(eq(gamesTable.id, params.gameId))

    return ok({ message: "Game updated!" })
  }
}