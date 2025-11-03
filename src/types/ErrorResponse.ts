/**
 * Interface para detalhes de erro de validação
 */
export interface ValidationErrorDetail {
  field: string
  message: string
  received?: any
}

/**
 * Interface padronizada para respostas de erro da API
 * Fornece informações estruturadas e descritivas sobre erros
 */
export interface ErrorResponse {
  error: {
    /** Código único identificando o tipo de erro (ex: 'GAME_NOT_FOUND', 'VALIDATION_ERROR') */
    code: string

    /** Mensagem legível descrevendo o erro */
    message: string

    /** Detalhes adicionais sobre o erro (ex: campos de validação, stack trace em dev) */
    details?: any

    /** Timestamp ISO 8601 de quando o erro ocorreu */
    timestamp: string

    /** Caminho do endpoint que gerou o erro */
    path?: string
  }
}
