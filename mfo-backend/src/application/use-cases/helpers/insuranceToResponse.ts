// src/application/use-cases/helpers/insuranceToResponse.ts

import { Insurance } from '@/domain/entities/Insurance'
import { InsuranceInternalResponse } from '@/application/dtos/InsuranceDTO'

export function insuranceToResponse(i: Insurance): InsuranceInternalResponse {
  return {
    id: i.id,
    clientId: i.clientId,
    type: i.type,
    name: i.name,
    coverage: i.coverage,
    premium: i.premium,
    startDate: i.startDate,
    endDate: i.endDate ?? null,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt ?? null,
  }
}