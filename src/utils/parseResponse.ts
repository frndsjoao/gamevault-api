import { HttpResponse } from "../types/Http";

export function parseResponse({statusCode, body}: HttpResponse) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body): undefined
  }
}