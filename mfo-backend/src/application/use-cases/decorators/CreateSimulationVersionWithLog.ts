// src/application/use-cases/decorators/CreateSimulationVersionWithLog.ts

import { ICreateSimulationVersionUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateSimulationVersionInput, SimulationResponse } from '@/application/dtos/SimulationDTO'

export class CreateSimulationVersionWithLog implements ICreateSimulationVersionUseCase {
  constructor(
    private createSimulationVersion: ICreateSimulationVersionUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateSimulationVersionInput): Promise<SimulationResponse> {
    try {
      return await this.createSimulationVersion.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateSimulationVersion] Falha ao criar versão da simulação ${input.simulationId}: ${error.message}`,
        { simulationId: input.simulationId, error }
      )
      throw error
    }
  }
}