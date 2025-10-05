import { apiAuth } from './api'

export async function getTwitchToken() {
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
