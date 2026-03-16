// src/application/dtos/SimulationDTO.ts

import { z } from 'zod'
import {
  CreateSimulationSchema,
  UpdateSimulationSchema,
  PrismaSimulationSchema,
  SimulationResponseSchema,
  SimulationListResponseSchema,
  ProjectionResponseSchema,
  CompareSimulationResponseSchema,
} from '@/schemas/simulation.schema'

// --- INPUTS ---
export type CreateSimulationInput = z.infer<typeof CreateSimulationSchema>
export type UpdateSimulationInput = z.infer<typeof UpdateSimulationSchema>

export interface GetSimulationByIdInput {
  simulationId: string
}

export interface DeleteSimulationInput {
  simulationId: string
}

export interface ListClientSimulationsInput {
  clientId: string
}

export interface CreateSimulationVersionInput {
  simulationId: string
  updateData?: UpdateSimulationInput
}

export interface GetProjectionInput {
  simulationId: string
  months: number
  scenario?: string
  eventMonth?: number
}

export interface CompareSimulationsInput {
  id1: string
  id2: string
  months: number
  scenario?: string
  eventMonth?: number
}

// --- OUTPUTS ---
// Tipo interno (antes da transformação para string ISO)
export type SimulationInternalResponse = z.infer<typeof PrismaSimulationSchema>

// Tipo externo (após a transformação, datas como string ISO)
export type SimulationResponse = z.infer<typeof SimulationResponseSchema>
export type SimulationListResponse = z.infer<typeof SimulationListResponseSchema>
export type ProjectionResponse = z.infer<typeof ProjectionResponseSchema>
export type CompareSimulationResponse = z.infer<typeof CompareSimulationResponseSchema>