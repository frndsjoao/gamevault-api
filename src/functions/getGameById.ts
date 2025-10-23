import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { badRequest } from "../utils/http"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { ListGameByIdController } from "../controllers/GetGameByIdController"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const response = await ListGameByIdController.handle(request)

    return parseResponse(response)
  } catch (error) {
    return parseResponse(badRequest({ error: "Something went wrong" }))
  }
}
