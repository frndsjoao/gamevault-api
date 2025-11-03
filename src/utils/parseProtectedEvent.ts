import { APIGatewayProxyEventV2 } from "aws-lambda"
import { ProtectedHttpRequest } from "../types/Http";
import { parseEvent } from "./parseEvent";
import { validateAccessToken } from "../lib/jwt";
import { UnauthorizedError } from "../errors/AppError";

export function parseProtectedEvent(event: APIGatewayProxyEventV2): ProtectedHttpRequest {
  const baseEvent = parseEvent(event)
  const authorization = event.headers.authorization || event.headers.Authorization

  if (!authorization) {
    throw new UnauthorizedError("Access token not provided")
  }

  const [, token] = authorization.split(' ')

  if (!token) {
    throw new UnauthorizedError("Invalid authorization header format")
  }

  const userId = validateAccessToken(token)

  if (!userId) {
    throw new UnauthorizedError("Invalid or expired access token")
  }

  return { ...baseEvent, userId }
}
