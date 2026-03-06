// src/application/use-cases/decorators/GetSimulationByIdWithLog.ts

import { IGetSimulationByIdUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { GetSimulationByIdInput, SimulationResponse } from '@/application/dtos/SimulationDTO'

export class GetSimulationByIdWithLog implements IGetSimulationByIdUseCase {
  constructor(
    private getSimulationById: IGetSimulationByIdUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: GetSimulationByIdInput): Promise<SimulationResponse> {
    try {
      return await this.getSimulationById.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[GetSimulationById] Falha ao buscar simulação ${input.simulationId}: ${error.message}`,
        { simulationId: input.simulationId, error }
      )
      throw error
    }
  }
}