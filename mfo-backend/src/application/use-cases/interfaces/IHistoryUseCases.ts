// src/application/use-cases/interfaces/IHistoryUseCases.ts

import {
  ListSimulationVersionsByClientInput,
  SimulationHistoryListResponse,
  GetSimulationVersionInput,
  SimulationHistoryResponse,
} from '@/application/dtos/HistoryDTO';

export interface IListSimulationVersionsByClientUseCase {
  execute(input: ListSimulationVersionsByClientInput): Promise<SimulationHistoryListResponse>;
}

export interface IGetSimulationVersionUseCase {
  execute(input: GetSimulationVersionInput): Promise<SimulationHistoryResponse>;
}