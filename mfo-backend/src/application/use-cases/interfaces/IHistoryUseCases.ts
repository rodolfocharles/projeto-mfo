// src/application/use-cases/interfaces/IHistoryUseCases.ts

import {
  ListSimulationVersionsByClientInput,
  SimulationHistoryListResponse,
  GetSimulationVersionInput,
  SimulationHistoryResponse,
  RealizedPatrimonyHistoryListResponse,
} from '@/application/dtos/HistoryDTO';

export interface IListSimulationVersionsByClientUseCase {
  execute(input: ListSimulationVersionsByClientInput): Promise<SimulationHistoryListResponse>;
}

export interface IGetSimulationVersionUseCase {
  execute(input: GetSimulationVersionInput): Promise<SimulationHistoryResponse>;
}

export interface IListLatestSimulationVersionsByClientUseCase {
  execute(input: ListSimulationVersionsByClientInput): Promise<SimulationHistoryListResponse>;
}

export interface IListRealizedPatrimonyByClientUseCase {
  execute(input: ListSimulationVersionsByClientInput): Promise<RealizedPatrimonyHistoryListResponse>;
}