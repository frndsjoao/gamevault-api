import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../../utils/parseResponse"
import { parseEvent } from "../../utils/parseEvent"
import { SignInController } from "../../controllers/auth/SignInController"

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event)
  const response = await SignInController.handle(request)

  return parseResponse(response)
}