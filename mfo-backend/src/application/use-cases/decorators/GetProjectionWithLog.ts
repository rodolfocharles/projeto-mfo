// src/application/use-cases/decorators/GetProjectionWithLog.ts

import { IGetProjectionUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { GetProjectionInput, ProjectionResponse } from '@/application/dtos/SimulationDTO'

export class GetProjectionWithLog implements IGetProjectionUseCase {
  constructor(
    private getProjection: IGetProjectionUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: GetProjectionInput): Promise<ProjectionResponse> {
    try {
      return await this.getProjection.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[GetProjection] Falha ao calcular projeção da simulação ${input.simulationId}: ${error.message}`,
        { simulationId: input.simulationId, months: input.months, scenario: input.scenario, error }
      )
      throw error
    }
  }
}