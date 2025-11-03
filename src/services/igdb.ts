import { ExternalServiceError } from '../errors/AppError'
import { api } from './api'

interface GetGameSearchByNameProps {
  accessToken: string
  clientId: string
  query: string
}
export async function getGameSearchByName({ clientId, accessToken, query }: GetGameSearchByNameProps) {
  try {
    const response = await api.post("/games", query, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-ID": clientId,
        "Content-Type": "text/plain"
      }
    })

    return response.data
  } catch (error: any) {
    throw new ExternalServiceError('IGDB', {
      message: error?.response?.data?.message || error?.message || 'Failed to search games',
      status: error?.response?.status,
      statusText: error?.response?.statusText
    })
  }
}
