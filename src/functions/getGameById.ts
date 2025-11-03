import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { ListGameByIdController } from "../controllers/GetGameByIdController"
import { handleError } from "../middleware/errorHandler"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await ListGameByIdController.handle(request)

    return parseResponse(response)
  } catch (error) {
    const errorResponse = handleError(error, event.rawPath)
    return parseResponse(errorResponse)
  }
}
