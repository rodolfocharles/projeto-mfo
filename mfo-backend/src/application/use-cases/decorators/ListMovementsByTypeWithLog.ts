// src/application/use-cases/decorators/ListMovementsByTypeWithLog.ts

import { IListMovementsByTypeUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ListMovementsByTypeInput, MovementListResponse } from '@/application/dtos/MovementDTO'

export class ListMovementsByTypeWithLog implements IListMovementsByTypeUseCase {
  constructor(
    private listMovementsByType: IListMovementsByTypeUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: ListMovementsByTypeInput): Promise<MovementListResponse> {
    try {
      return await this.listMovementsByType.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[ListMovementsByType] Falha ao listar movimentos do tipo ${input.type} para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, type: input.type, error }
      )
      throw error
    }
  }
}