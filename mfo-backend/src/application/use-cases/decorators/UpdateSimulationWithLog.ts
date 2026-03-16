// src/application/use-cases/decorators/UpdateSimulationWithLog.ts

import { IUpdateSimulationUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { UpdateSimulationInput, SimulationResponse } from '@/application/dtos/SimulationDTO'

export class UpdateSimulationWithLog implements IUpdateSimulationUseCase {
  constructor(
    private updateSimulation: IUpdateSimulationUseCase,
    private logger: ILogger,
  ) {}

  async execute(simulationId: string, input: UpdateSimulationInput): Promise<SimulationResponse> {
    try {
      return await this.updateSimulation.execute(simulationId, input)
    } catch (error: any) {
      this.logger.error(
        `[UpdateSimulation] Falha ao atualizar simulação ${simulationId}: ${error.message}`,
        { simulationId, error }
      )
      throw error
    }
  }
}