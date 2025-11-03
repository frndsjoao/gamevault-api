import z from "zod";
import { ValidationErrorDetail } from "../types/ErrorResponse";

/**
 * @deprecated Use handleError from middleware/errorHandler.ts instead
 * This function is kept for backward compatibility but will be removed in future versions
 */
type ParsedSchemaErrors = string[]

/**
 * @deprecated Use handleError from middleware/errorHandler.ts instead
 * Parse Zod schema validation errors into array of strings
 */
export function parseSchemaErrors(issues: z.core.$ZodIssue[]): ParsedSchemaErrors {
  if (!issues) return [];

  const errors = issues.map(issue => `${issue.path.join(".")}: ${issue.message}`);

  return errors
}

/**
 * Parse Zod schema validation errors into structured objects
 * Provides detailed information about each validation error
 *
 * @param issues - Array of Zod validation issues
 * @returns Array of structured validation error details
 */
export function parseSchemaErrorsStructured(issues: z.ZodIssue[]): ValidationErrorDetail[] {
  if (!issues) return [];

  return issues.map(issue => ({
    field: issue.path.join('.') || 'unknown',
    message: issue.message,
    received: 'received' in issue ? issue.received : undefined
  }));
}