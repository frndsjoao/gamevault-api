import z from "zod";

type ParsedSchemaErrors = string[]

export function parseSchemaErrors(issues: z.core.$ZodIssue[]): ParsedSchemaErrors {
  if (!issues) return [];

  const errors = issues.map(issue => `${issue.path.join(".")}: ${issue.message}`);

  return errors
}