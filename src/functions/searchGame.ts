import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { SearchGameController } from "../controllers/SearchGameController"
import { handleError } from "../middleware/errorHandler"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await SearchGameController.handle(request)

    return parseResponse(response)
  } catch (error) {
    const errorResponse = handleError(error, event.rawPath)
    return parseResponse(errorResponse)
  }
}
