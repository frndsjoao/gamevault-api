import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../../utils/parseResponse"
import { parseEvent } from "../../utils/parseEvent"
import { SignUpController } from "../../controllers/auth/SignUpController"
import { handleError } from "../../middleware/errorHandler"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseEvent(event)
    const response = await SignUpController.handle(request)

    return parseResponse(response)
  } catch (error) {
    const errorResponse = handleError(error, event.rawPath)
    return parseResponse(errorResponse)
  }
}
