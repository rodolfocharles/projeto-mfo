// src/application/dtos/InsuranceDTO.ts

import { z } from 'zod'
import {
  CreateInsuranceSchema,
  UpdateInsuranceSchema,
  PrismaInsuranceSchema,
  InsuranceResponseSchema,
  InsuranceListResponseSchema,
} from '@/schemas/insurance.schema'

// --- INPUTS ---
export type CreateInsuranceInput = z.infer<typeof CreateInsuranceSchema>
export type UpdateInsuranceInput = z.infer<typeof UpdateInsuranceSchema>

export interface GetInsuranceByIdInput {
  insuranceId: string
}

export interface DeleteInsuranceInput {
  insuranceId: string
}

export interface ListClientInsurancesInput {
  clientId: string
}

// --- OUTPUTS ---
// Tipo interno (antes da transformação para string ISO)
export type InsuranceInternalResponse = z.infer<typeof PrismaInsuranceSchema>

// Tipo externo (após a transformação, datas como string ISO)
export type InsuranceResponse = z.infer<typeof InsuranceResponseSchema>
export type InsuranceListResponse = z.infer<typeof InsuranceListResponseSchema>