// src/application/use-cases/helpers/historyToResponse.ts

import { History } from '@/domain/entities/History';
import { SimulationHistoryResponse } from '@/application/dtos/HistoryDTO';

export function historyToResponse(history: History): SimulationHistoryResponse {
  return {
    id: history.id,
    clientId: history.clientId,
    name: history.name,
    version: history.version,
    startDate: history.startDate.toISOString(),
    realRate: history.realRate,
    inflation: history.inflation,
    lifeStatus: history.lifeStatus,
    createdAt: history.createdAt.toISOString(),
    updatedAt: history.updatedAt ? history.updatedAt.toISOString() : null,
  };
}