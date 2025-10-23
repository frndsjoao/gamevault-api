import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { badRequest } from "../utils/http"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { SearchGameController } from "../controllers/SearchGameController"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await SearchGameController.handle(request)

    return parseResponse(response)
  } catch (error) {
    return parseResponse(badRequest({ error: "Something went wrong" }))
  }
}
