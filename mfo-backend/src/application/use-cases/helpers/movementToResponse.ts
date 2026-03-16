// src/application/use-cases/helpers/movementToResponse.ts

import { Movement } from '@/domain/entities/Movement'
import { MovementInternalResponse } from '@/application/dtos/MovementDTO'

export function movementToResponse(m: Movement): MovementInternalResponse {
  return {
    id: m.id,
    clientId: m.clientId,
    name: m.name,
    type: m.type,
    value: m.value,
    startDate: m.startDate,
    endDate: m.endDate ?? null,
    frequency: m.frequency,
    isRecurrent: m.isRecurrent,
    isIndexed: m.isIndexed,
    indexationRate: m.indexationRate ?? null,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt ?? null,
  }
}