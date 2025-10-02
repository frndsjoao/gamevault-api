import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { unauthorized } from "../utils/http"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { DeleteGameByIdController } from "../controllers/DeleteGameByIdController"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await DeleteGameByIdController.handle(request)

    return parseResponse(response)
  } catch (error) {
    return parseResponse(unauthorized({ error: "Invalid access token." }))
  }
}