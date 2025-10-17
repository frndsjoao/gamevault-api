import { getDb } from "../db";
import { gamesTable } from "../db/schema";
import { gameSchema } from "../schemas/gameSchema";
import { parseSchemaErrors } from "../schemas/parseSchemaErrors";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http"
import { badRequest, created } from "../utils/http"

export class AddGameController {
  static async handle({ userId, body }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const { success, error } = gameSchema.safeParse(body)

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    const [newGame] = await db.insert(gamesTable).values({
      userId,
      name: body.name,
      platform: body.platform,
      rating: body.rating,
      platinum: body.platinum,
      cover: body.cover,
      igdbId: body.igdbId,
      status: body.status
    }).returning({ id: gamesTable.id });

    return created({ gameId: newGame.id, message: "Game added!" })
  }
}