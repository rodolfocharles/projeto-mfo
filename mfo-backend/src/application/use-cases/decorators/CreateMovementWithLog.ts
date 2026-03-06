// src/application/use-cases/decorators/CreateMovementWithLog.ts

import { ICreateMovementUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateMovementInput, MovementResponse } from '@/application/dtos/MovementDTO'

export class CreateMovementWithLog implements ICreateMovementUseCase {
  constructor(
    private createMovement: ICreateMovementUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateMovementInput): Promise<MovementResponse> {
    try {
      return await this.createMovement.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateMovement] Falha ao criar movimento para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, movementName: input.name, error }
      )
      throw error
    }
  }
}