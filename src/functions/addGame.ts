import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { unauthorized } from "../utils/http"
import { AddGameController } from "../controllers/AddGameController"
import { parseEvent } from "../utils/parseEvent"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseEvent(event)
    const response = await AddGameController.handle(request)

    return parseResponse(response)
  } catch (error) {
    return parseResponse(unauthorized({ error: "Invalid access token." }))
  }
}