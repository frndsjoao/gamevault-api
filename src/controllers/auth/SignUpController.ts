import { eq } from "drizzle-orm"
import { getDb } from "../../db"
import { signUpschema } from "../../schemas/gameSchema"
import { HttpRequest, HttpResponse } from "../../types/Http"
import { created } from "../../utils/http"
import { usersTable } from "../../db/schema"
import { hash } from "bcryptjs"
import { ConflictError, DatabaseError, ValidationError } from "../../errors/AppError"

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const db = getDb()
    const { success, error, data } = signUpschema.safeParse(body)

    if (!success) {
      throw new ValidationError('Invalid user data', error.issues)
    }

    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: { email: true },
      where: eq(usersTable.email, data.email),
    })

    if (userAlreadyExists) {
      throw new ConflictError('This email is already in use', { email: data.email })
    }

    const hashedPassword = await hash(data.password, 10)

    try {
      const [user] = await db
        .insert(usersTable)
        .values({
          ...data,
          password: hashedPassword,
        })
        .returning({ id: usersTable.id })

      if (!user?.id) {
        throw new DatabaseError('Failed to create user - no ID returned')
      }

      return created({ success: true })
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Failed to create user', error)
    }
  }
}
