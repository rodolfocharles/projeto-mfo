// src/application/use-cases/decorators/ListClientMovementsWithLog.ts

import { IListClientMovementsUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { MovementListResponse } from '@/application/dtos/MovementDTO'

export class ListClientMovementsWithLog implements IListClientMovementsUseCase {
  constructor(
    private listClientMovements: IListClientMovementsUseCase,
    private logger: ILogger,
  ) {}

  async execute(clientId: string): Promise<MovementListResponse> {
    try {
      return await this.listClientMovements.execute(clientId)
    } catch (error: any) {
      this.logger.error(
        `[ListClientMovements] Falha ao listar movimentos do cliente ${clientId}: ${error.message}`,
        { clientId, error }
      )
      throw error
    }
  }
}