// src/application/use-cases/decorators/DeleteSimulationWithLog.ts

import { IDeleteSimulationUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { DeleteSimulationInput } from '@/application/dtos/SimulationDTO'

export class DeleteSimulationWithLog implements IDeleteSimulationUseCase {
  constructor(
    private deleteSimulation: IDeleteSimulationUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: DeleteSimulationInput): Promise<void> {
    try {
      await this.deleteSimulation.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[DeleteSimulation] Falha ao deletar simulação ${input.simulationId}: ${error.message}`,
        { simulationId: input.simulationId, error }
      )
      throw error
    }
  }
}