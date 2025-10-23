import { and, eq } from "drizzle-orm"
import { getDb } from "../db"
import { gamesTable } from "../db/schema"
import { gameSchema } from "../schemas/gameSchema"
import { parseSchemaErrors } from "../schemas/parseSchemaErrors"
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { badRequest, notFound, ok } from "../utils/http"

export class UpdateGameByIdController {
  static async handle({
    userId,
    body,
    params,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()
    const { success, error } = gameSchema.safeParse(body)

    if (!success) {
      return badRequest({ error: parseSchemaErrors(error.issues) })
    }

    const game = await db.query.gamesTable.findFirst({
      where: and(
        eq(gamesTable.userId, userId),
        eq(gamesTable.id, params.gameId),
      ),
    })

    if (!game) {
      return notFound({ error: "Game not found." })
    }

    try {
      await db
        .update(gamesTable)
        .set(body)
        .where(eq(gamesTable.id, params.gameId))
    } catch (error) {
      return badRequest({ error: "Something went wrong." })
    }

    return ok({ message: "Game updated!" })
  }
}
