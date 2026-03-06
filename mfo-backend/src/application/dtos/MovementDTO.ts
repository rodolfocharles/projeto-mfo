// Adicionar em src/application/dtos/MovementDTO.ts

import { z } from 'zod'
import {
  CreateMovementSchema,
  UpdateMovementSchema,
  PrismaMovementSchema, // ← precisa existir no schema
  MovementResponseSchema,
  MovementListResponseSchema,
} from '@/schemas/movement.schema'

// --- INPUTS ---
export type CreateMovementInput = z.infer<typeof CreateMovementSchema>
export type UpdateMovementInput = z.infer<typeof UpdateMovementSchema>

export interface GetMovementByIdInput {
  movementId: string
}

export interface DeleteMovementInput {
  movementId: string
}

export interface ListClientMovementsInput {
  clientId: string
}

export interface MovementSummaryInput {
  clientId: string
}

export interface ListMovementsByTypeInput {
  clientId: string
  type: string
}

// --- OUTPUTS ---
// Tipo interno (antes da transformação para string ISO)
export type MovementInternalResponse = z.infer<typeof PrismaMovementSchema>

// Tipo externo (após a transformação, datas como string ISO)
export type MovementResponse = z.infer<typeof MovementResponseSchema>
export type MovementListResponse = z.infer<typeof MovementListResponseSchema>
export type MovementSummaryResponse = z.infer<typeof MovementSummarySchema> // ← se tiver