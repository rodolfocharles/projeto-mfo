// src/application/use-cases/interfaces/IMovementUseCases.ts

import {
  CreateMovementInput,
  UpdateMovementInput,
  MovementResponse,
  MovementListResponse,
  MovementSummaryInput,
  MovementSummaryResponse,
  ListMovementsByTypeInput,
} from '@/application/dtos/MovementDTO'

export interface ICreateMovementUseCase {
  execute(input: CreateMovementInput): Promise<MovementResponse>
}

export interface IListClientMovementsUseCase {
  execute(clientId: string): Promise<MovementListResponse>
}

export interface IGetMovementByIdUseCase {
  execute(id: string): Promise<MovementResponse>
}

export interface IUpdateMovementUseCase {
  execute(id: string, input: UpdateMovementInput): Promise<MovementResponse>
}

export interface IDeleteMovementUseCase {
  execute(id: string): Promise<void>
}

export interface IGetMovementSummaryUseCase {
  execute(input: MovementSummaryInput): Promise<MovementSummaryResponse>
}

export interface IListMovementsByTypeUseCase {
  execute(input: ListMovementsByTypeInput): Promise<MovementListResponse>
}