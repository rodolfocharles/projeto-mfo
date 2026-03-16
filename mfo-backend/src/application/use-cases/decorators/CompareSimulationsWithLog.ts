// src/application/use-cases/decorators/CompareSimulationsWithLog.ts

import { ICompareSimulationsUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CompareSimulationsInput, CompareSimulationResponse } from '@/application/dtos/SimulationDTO'

export class CompareSimulationsWithLog implements ICompareSimulationsUseCase {
  constructor(
    private compareSimulations: ICompareSimulationsUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CompareSimulationsInput): Promise<CompareSimulationResponse> {
    try {
      return await this.compareSimulations.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CompareSimulations] Falha ao comparar simulações ${input.id1} e ${input.id2}: ${error.message}`,
        { simulationId1: input.id1, simulationId2: input.id2, months: input.months, error }
      )
      throw error
    }
  }
}