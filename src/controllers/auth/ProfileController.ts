import { eq } from "drizzle-orm"
import { getDb } from "../../db"
import { HttpResponse, ProtectedHttpRequest } from "../../types/Http"
import { ok } from "../../utils/http"
import { usersTable } from "../../db/schema"
import { NotFoundError } from "../../errors/AppError"

export class ProfileController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb()

    const user = await db.query.usersTable.findFirst({
      columns: {
        name: true,
        avatar: true,
        email: true,
        birthdate: true,
        preferredPlatform: true,
      },
      where: eq(usersTable.id, userId),
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    return ok(user)
  }
}
