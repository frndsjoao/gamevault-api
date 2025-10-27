import { APIGatewayProxyEventV2 } from "aws-lambda"
import { parseResponse } from "../utils/parseResponse"
import { badRequest } from "../utils/http"
import { parseProtectedEvent } from "../utils/parseProtectedEvent"
import { ListGamesController } from "../controllers/ListGamesController"
import { GameStatusType } from "../types/GameStatus"

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event)
    const filter: GameStatusType = event.queryStringParameters?.filter ?? ""
    const page = event.queryStringParameters?.page
      ? parseInt(event.queryStringParameters.page)
      : 1

    const response = await ListGamesController.handle({
      ...request,
      page,
      filter,
    })

    return parseResponse(response)
  } catch (error) {
    return parseResponse(badRequest({ error: "Something went wrong" }))
  }
}
