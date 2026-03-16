// src/application/use-cases/ListLatestSimulationVersionsByClient.ts

import { IHistoriesRepository } from '@/domain/repositories/IHistoriesRepository';
import {
  ListSimulationVersionsByClientInput,
  SimulationHistoryListResponse,
} from '@/application/dtos/HistoryDTO';
import { IListLatestSimulationVersionsByClientUseCase } from './interfaces/IHistoryUseCases';
import { historyToResponse } from './helpers/historyToResponse';

export class ListLatestSimulationVersionsByClient
  implements IListLatestSimulationVersionsByClientUseCase
{
  constructor(private historiesRepository: IHistoriesRepository) {}

  async execute(
    input: ListSimulationVersionsByClientInput,
  ): Promise<SimulationHistoryListResponse> {
    const histories = await this.historiesRepository.findByClientId(input.id);

    const latestByName = new Map<string, typeof histories[number]>();

    for (const history of histories) {
      const existing = latestByName.get(history.name);
      if (!existing || history.version > existing.version) {
        latestByName.set(history.name, history);
      }
    }

    const latestHistories = Array.from(latestByName.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return latestHistories.map(historyToResponse);
  }
}

