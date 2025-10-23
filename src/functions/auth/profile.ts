import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseProtectedEvent } from "../../utils/parseProtectedEvent"
import { ProfileController } from "../../controllers/auth/ProfileController"
import { parseResponse } from "../../utils/parseResponse"
import { badRequest } from "../../utils/http"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await ProfileController.handle(request)

    return parseResponse(response)
  } catch (error) {
    return parseResponse(badRequest({ error: "Something went wrong." }))
  }
}
