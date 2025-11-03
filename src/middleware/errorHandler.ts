import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'
import { ErrorResponse, ValidationErrorDetail } from '../types/ErrorResponse'
import { HttpResponse } from '../types/Http'
import { internalServerError } from '../utils/http'

/**
 * Middleware global de tratamento de erros
 * Captura todos os erros da aplicação e retorna respostas padronizadas
 *
 * @param error - Erro capturado (pode ser AppError, ZodError ou erro genérico)
 * @param path - Caminho do endpoint que gerou o erro (opcional)
 * @returns HttpResponse com formato ErrorResponse padronizado
 */
export function handleError(error: unknown, path?: string): HttpResponse {
  // Log do erro para debugging (em produção, usar serviço de logging)
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    path,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error
  })

  // Erro conhecido da aplicação (AppError e suas classes derivadas)
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp: new Date().toISOString(),
          path
        }
      } as ErrorResponse
    }
  }

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    const validationDetails: ValidationErrorDetail[] = error.issues.map(issue => ({
      field: issue.path.join('.') || 'unknown',
      message: issue.message,
      received: 'received' in issue ? issue.received : undefined
    }))

    return {
      statusCode: 400,
      body: {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationDetails,
          timestamp: new Date().toISOString(),
          path
        }
      } as ErrorResponse
    }
  }

  // Erro genérico do JavaScript
  if (error instanceof Error) {
    return internalServerError({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        // Só incluir detalhes técnicos em desenvolvimento
        details: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined,
        timestamp: new Date().toISOString(),
        path
      }
    } as ErrorResponse)
  }

  // Erro completamente desconhecido
  return internalServerError({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      timestamp: new Date().toISOString(),
      path
    }
  } as ErrorResponse)
}
