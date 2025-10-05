import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { usersTable } from "../db/schema";
import { getTwitchToken } from "../services/twitchAuth";
import { addSeconds } from "date-fns";

function calculateTokenExpirationDate(expiresIn: number): Date {
  return addSeconds(new Date(), expiresIn)
}

export async function getTwitchValidToken(userId: string) {
  const db = getDb()

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId)
  })

  if (user?.twitchToken && user.twitchTokenExpireDate && user.twitchTokenExpireDate > new Date()) {
    console.log("user: ", user.twitchToken)
    return user.twitchToken
  }

  const newToken = await getTwitchToken()
  const expiresAt = calculateTokenExpirationDate(newToken.expires_in)

  await db
    .update(usersTable)
    .set({
      twitchToken: newToken.access_token,
      twitchTokenExpireDate: expiresAt,
      twitchTokenType: newToken.token_type
    })
    .where(eq(usersTable.id, userId))


  console.log("new token: ", newToken.access_token)
  return newToken.access_token
}