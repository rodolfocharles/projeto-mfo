// src/application/use-cases/decorators/DeleteMovementWithLog.ts

import { IDeleteMovementUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'

export class DeleteMovementWithLog implements IDeleteMovementUseCase {
  constructor(
    private deleteMovement: IDeleteMovementUseCase,
    private logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      await this.deleteMovement.execute(id)
    } catch (error: any) {
      this.logger.error(
        `[DeleteMovement] Falha ao deletar movimento ${id}: ${error.message}`,
        { movementId: id, error }
      )
      throw error
    }
  }
}