// src/application/use-cases/decorators/GetMovementSummaryWithLog.ts

import { IGetMovementSummaryUseCase } from '../interfaces/IMovementUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { MovementSummaryInput, MovementSummaryResponse } from '@/application/dtos/MovementDTO'

export class GetMovementSummaryWithLog implements IGetMovementSummaryUseCase {
  constructor(
    private getMovementSummary: IGetMovementSummaryUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: MovementSummaryInput): Promise<MovementSummaryResponse> {
    try {
      return await this.getMovementSummary.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[GetMovementSummary] Falha ao buscar resumo do cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, error }
      )
      throw error
    }
  }
}