// src/application/use-cases/decorators/UpdateMovementWithLog.ts

import { IUpdateMovementUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { UpdateMovementInput, MovementResponse } from '@/application/dtos/MovementDTO'

export class UpdateMovementWithLog implements IUpdateMovementUseCase {
  constructor(
    private updateMovement: IUpdateMovementUseCase,
    private logger: ILogger,
  ) {}

  async execute(id: string, input: UpdateMovementInput): Promise<MovementResponse> {
    try {
      return await this.updateMovement.execute(id, input)
    } catch (error: any) {
      this.logger.error(
        `[UpdateMovement] Falha ao atualizar movimento ${id}: ${error.message}`,
        { movementId: id, error }
      )
      throw error
    }
  }
}