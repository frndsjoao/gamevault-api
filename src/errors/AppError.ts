/**
 * Classe base para erros personalizados da aplicação
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Erro de validação (400)
 * Usado quando os dados enviados pelo cliente são inválidos
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

/**
 * Erro de não autorizado (401)
 * Usado quando o usuário não está autenticado ou token é inválido
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED', undefined)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Erro de recurso não encontrado (404)
 * Usado quando o recurso solicitado não existe
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', undefined)
    this.name = 'NotFoundError'
  }
}

/**
 * Erro de conflito (409)
 * Usado quando há conflito com o estado atual (ex: email já existe)
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT', details)
    this.name = 'ConflictError'
  }
}

/**
 * Erro de banco de dados (500)
 * Usado quando ocorre erro nas operações de banco de dados
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error occurred', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

/**
 * Erro de serviço externo (503)
 * Usado quando APIs externas falham (IGDB, Twitch, etc)
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, details?: any) {
    super(`External service ${service} failed`, 503, 'EXTERNAL_SERVICE_ERROR', details)
    this.name = 'ExternalServiceError'
  }
}

/**
 * Erro interno do servidor (500)
 * Usado para erros inesperados do servidor
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details)
    this.name = 'InternalServerError'
  }
}
