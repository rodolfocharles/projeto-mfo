// src/application/use-cases/interfaces/ISimulationUseCases.ts

import {
  CreateSimulationInput,
  UpdateSimulationInput,
  SimulationResponse,
  SimulationListResponse,
  GetSimulationByIdInput,
  DeleteSimulationInput,
  ListClientSimulationsInput,
  CreateSimulationVersionInput,
  GetProjectionInput,
  CompareSimulationsInput,
  ProjectionResponse,
  CompareSimulationResponse,
} from '@/application/dtos/SimulationDTO'

export interface ICreateSimulationUseCase {
  execute(input: CreateSimulationInput): Promise<SimulationResponse>
}

export interface IListClientSimulationsUseCase {
  execute(input: ListClientSimulationsInput): Promise<SimulationListResponse>
}

export interface IGetSimulationByIdUseCase {
  execute(input: GetSimulationByIdInput): Promise<SimulationResponse>
}

export interface IUpdateSimulationUseCase {
  execute(simulationId: string, input: UpdateSimulationInput): Promise<SimulationResponse>
}

export interface IDeleteSimulationUseCase {
  execute(input: DeleteSimulationInput): Promise<void>
}

export interface ICreateSimulationVersionUseCase {
  execute(input: CreateSimulationVersionInput): Promise<SimulationResponse>
}

export interface IGetProjectionUseCase {
  execute(input: GetProjectionInput): Promise<ProjectionResponse>
}

export interface ICompareSimulationsUseCase {
  execute(input: CompareSimulationsInput): Promise<CompareSimulationResponse>
}