import { apiAuth } from './api'

interface TwitchTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export async function getTwitchToken(): Promise<TwitchTokenResponse> {
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET
  const grantType = 'client_credentials'

  const response = await apiAuth.post("/token", {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType
  })

  return response.data
}
