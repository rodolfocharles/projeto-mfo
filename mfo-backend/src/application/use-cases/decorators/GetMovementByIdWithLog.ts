// src/application/use-cases/decorators/GetMovementByIdWithLog.ts

import { IGetMovementByIdUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { MovementResponse } from '@/application/dtos/MovementDTO'

export class GetMovementByIdWithLog implements IGetMovementByIdUseCase {
  constructor(
    private getMovementById: IGetMovementByIdUseCase,
    private logger: ILogger,
  ) {}

  async execute(id: string): Promise<MovementResponse> {
    try {
      return await this.getMovementById.execute(id)
    } catch (error: any) {
      this.logger.error(
        `[GetMovementById] Falha ao buscar movimento ${id}: ${error.message}`,
        { movementId: id, error }
      )
      throw error
    }
  }
}