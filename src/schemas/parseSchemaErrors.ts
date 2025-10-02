import z from "zod";

type ParsedSchemaErrors = {
  path: string;
  message: string
}[]

export function parseSchemaErrors(issues: z.core.$ZodIssue[]): ParsedSchemaErrors {
  if (!issues) return [];

  const errors = issues.map(issue => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return errors
}