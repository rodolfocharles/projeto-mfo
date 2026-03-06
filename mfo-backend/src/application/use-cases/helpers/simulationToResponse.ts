// src/application/use-cases/helpers/simulationToResponse.ts

import { Simulation } from '@/domain/entities/Simulation'
import { SimulationInternalResponse } from '@/application/dtos/SimulationDTO'

export function simulationToResponse(s: Simulation): SimulationInternalResponse {
  return {
    id: s.id,
    clientId: s.clientId,
    name: s.name,
    startDate: s.startDate,
    realRate: s.realRate,
    inflation: s.inflation,
    lifeStatus: s.lifeStatus,
    version: s.version,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt ?? null,
  }
}