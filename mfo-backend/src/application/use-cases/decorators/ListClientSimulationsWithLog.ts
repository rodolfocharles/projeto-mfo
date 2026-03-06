// src/application/use-cases/decorators/ListClientSimulationsWithLog.ts

import { IListClientSimulationsUseCase } from '../interfaces/ISimulationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ListClientSimulationsInput, SimulationListResponse } from '@/application/dtos/SimulationDTO'

export class ListClientSimulationsWithLog implements IListClientSimulationsUseCase {
  constructor(
    private listClientSimulations: IListClientSimulationsUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: ListClientSimulationsInput): Promise<SimulationListResponse> {
    try {
      return await this.listClientSimulations.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[ListClientSimulations] Falha ao listar simulações do cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, error }
      )
      throw error
    }
  }
}