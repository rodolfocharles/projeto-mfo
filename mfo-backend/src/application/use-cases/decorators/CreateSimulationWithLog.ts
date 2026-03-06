// src/application/use-cases/decorators/CreateSimulationWithLog.ts

import { ICreateSimulationUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateSimulationInput, SimulationResponse } from '@/application/dtos/SimulationDTO'

export class CreateSimulationWithLog implements ICreateSimulationUseCase {
  constructor(
    private createSimulation: ICreateSimulationUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateSimulationInput): Promise<SimulationResponse> {
    try {
      return await this.createSimulation.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateSimulation] Falha ao criar simulação para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, simulationName: input.name, error }
      )
      throw error
    }
  }
}