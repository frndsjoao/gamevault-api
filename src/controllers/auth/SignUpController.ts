import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { signUpschema } from "../../schemas/gameSchema";
import { parseSchemaErrors } from "../../schemas/parseSchemaErrors";
import { HttpRequest, HttpResponse } from "../../types/Http";
import { badRequest, conflict, created } from "../../utils/http";
import { usersTable } from "../../db/schema";
import { hash } from "bcryptjs";

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const { success, error, data } = signUpschema.safeParse(body)

    if (!success) {
      return badRequest({ error: parseSchemaErrors(error.issues) })
    }

    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: { email: true },
      where: eq(usersTable.email, data.email)
    })

    if (userAlreadyExists) {
      return conflict({ error: "This email is already in use!" })
    }

    const hashedPassword = await hash(data.password, 10)

    const [user] = await db
      .insert(usersTable)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning({ id: usersTable.id })

    if (user.id) {
      return created({ success: true })
    }
    return badRequest({ success: false, error: "Something went wrong" })
  }
}