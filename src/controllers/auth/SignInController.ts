import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { signInschema } from "../../schemas/gameSchema";
import { parseSchemaErrors } from "../../schemas/parseSchemaErrors";
import { HttpRequest, HttpResponse } from "../../types/Http";
import { badRequest, ok, unauthorized } from "../../utils/http";
import { usersTable } from "../../db/schema";
import { compare } from "bcryptjs";
import { signAccessToken } from "../../lib/jwt";

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const { success, error, data } = signInschema.safeParse(body)

    if (!success) {
      return badRequest({ errors: parseSchemaErrors(error.issues) })
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, data.email)
    })

    if (!user) {
      return unauthorized({ errors: ["Invalid credentials."] })
    }

    const isPasswordValid = await compare(data.password, user.password)
    if (!isPasswordValid) {
      return unauthorized({ errors: ["Invalid credentials."] })
    }

    const response = {
      accessToken: signAccessToken(user.id),
      name: user.name,
      profilepic: user.profilepic,
      email: user.email,
      birthDate: user.birthDate,
      preferredPlatform: user.preferredPlatform,
      createdAt: user.createdAt,
    }

    return ok(response)
  }
}