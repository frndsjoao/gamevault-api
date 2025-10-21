import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { HttpResponse, ProtectedHttpRequest } from "../../types/Http";
import { ok, unauthorized } from "../../utils/http";
import { usersTable } from "../../db/schema";

export class GetProfileController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const user = await db.query.usersTable.findFirst({
      columns: { name: true, email: true, profilepic: true, birthDate: true, preferredPlatform: true, createdAt: true },
      where: eq(usersTable.id, userId)
    })

    if (!user) {
      return unauthorized({ errors: ["User not found."] })
    }

    const response = {
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