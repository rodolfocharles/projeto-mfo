// src/lib/schemas/common.schema.ts
import { z } from 'zod'

export const UUIDSchema = z.string().uuid()
export const DateTimeSchema = z.string().datetime()
export const PositiveNumberSchema = z.number().positive()
export const NonNegativeNumberSchema = z.number().min(0)

export const ErrorResponseSchema = z.object({
    message: z.string(),
    statusCode: z.number().optional(),
    error: z.string().optional(),
})

// Tipos TypeScript
export type UUID = z.infer<typeof UUIDSchema>
export type DateTime = z.infer<typeof DateTimeSchema>
export type PositiveNumber = z.infer<typeof PositiveNumberSchema>
export type NonNegativeNumber = z.infer<typeof NonNegativeNumberSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
