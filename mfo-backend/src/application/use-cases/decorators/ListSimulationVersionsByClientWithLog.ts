// src/application/use-cases/decorators/ListSimulationVersionsByClientWithLog.ts

import { IListSimulationVersionsByClientUseCase } from '../interfaces/IHistoryUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ListSimulationVersionsByClientInput, SimulationHistoryListResponse } from '@/application/dtos/HistoryDTO'

export class ListSimulationVersionsByClientWithLog implements IListSimulationVersionsByClientUseCase {
  constructor(
    private listSimulationVersionsByClient: IListSimulationVersionsByClientUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: ListSimulationVersionsByClientInput): Promise<SimulationHistoryListResponse> {
    try {
      return await this.listSimulationVersionsByClient.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[ListSimulationVersionsByClient] Falha ao listar versões de simulações para cliente ${input.id}: ${error.message}`,
        { clientId: input.id, error }
      )
      throw error
    }
  }
}