import { getDb } from "../db";
import { gamesTable } from "../db/schema";
import { gameSchema } from "../schemas/gameSchema";
import { parseSchemaErrors } from "../schemas/parseSchemaErrors";
import { HttpRequest, HttpResponse } from "../types/Http"
import { badRequest, created } from "../utils/http"

export class AddGameController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const { success, error } = gameSchema.safeParse(body)

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    const [newGame] = await db.insert(gamesTable).values({
      name: body.name,
      platform: body.platform,
      rating: body.rating,
      platinum: body.platinum,
    }).returning({ id: gamesTable.id });

    return created({ gameId: newGame.id, message: "Game added!" })
  }
}