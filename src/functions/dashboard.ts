import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { badRequest } from "../utils/http"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { GameDashboardController } from "../controllers/GameDashboardController"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await GameDashboardController.handle(request)

    return parseResponse(response)
  } catch (error) {
    return parseResponse(badRequest({ error: "Something went wrong" }))
  }
}
