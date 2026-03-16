// src/application/use-cases/decorators/ListLatestSimulationVersionsByClientWithLog.ts

import { IListLatestSimulationVersionsByClientUseCase } from '../interfaces/IHistoryUseCases';
import { ILogger } from '@/domain/services/ILogger';
import {
  ListSimulationVersionsByClientInput,
  SimulationHistoryListResponse,
} from '@/application/dtos/HistoryDTO';

export class ListLatestSimulationVersionsByClientWithLog
  implements IListLatestSimulationVersionsByClientUseCase
{
  constructor(
    private listLatestSimulationVersionsByClient: IListLatestSimulationVersionsByClientUseCase,
    private logger: ILogger,
  ) {}

  async execute(
    input: ListSimulationVersionsByClientInput,
  ): Promise<SimulationHistoryListResponse> {
    try {
      return await this.listLatestSimulationVersionsByClient.execute(input);
    } catch (error: any) {
      this.logger.error(
        `[ListLatestSimulationVersionsByClient] Falha ao listar últimas versões de simulações para cliente ${input.id}: ${error.message}`,
        { clientId: input.id, error },
      );
      throw error;
    }
  }
}

