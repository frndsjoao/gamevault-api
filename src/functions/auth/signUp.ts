import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../../utils/parseResponse"
import { parseEvent } from "../../utils/parseEvent"
import { SignUpController } from "../../controllers/auth/SignUpController"

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event)
  const response = await SignUpController.handle(request)

  return parseResponse(response)
}
