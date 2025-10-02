import jwt from "jsonwebtoken"

export function signAccessToken(userId: string) {
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: "3d" })

  return accessToken
}

export function validateAccessToken(token: string) {
  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload

    return sub ?? null
  } catch (error) {
    return null
  }
}