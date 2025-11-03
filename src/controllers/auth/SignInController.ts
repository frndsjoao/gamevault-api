import { eq } from "drizzle-orm"
import { getDb } from "../../db"
import { signInschema } from "../../schemas/gameSchema"
import { HttpRequest, HttpResponse } from "../../types/Http"
import { ok } from "../../utils/http"
import { usersTable } from "../../db/schema"
import { compare } from "bcryptjs"
import { signAccessToken } from "../../lib/jwt"
import { UnauthorizedError, ValidationError } from "../../errors/AppError"

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const db = getDb()
    const { success, error, data } = signInschema.safeParse(body)

    if (!success) {
      throw new ValidationError("Invalid credentials format", error)
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, data.email),
    })

    if (!user) {
      throw new UnauthorizedError("Invalid credentials")
    }

    const isPasswordValid = await compare(data.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials")
    }

    const response = {
      accessToken: signAccessToken(user.id),
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      birthdate: user.birthdate,
      preferredPlatform: user.preferredPlatform,
      createdAt: user.createdAt,
    }

    return ok(response)
  }
}
