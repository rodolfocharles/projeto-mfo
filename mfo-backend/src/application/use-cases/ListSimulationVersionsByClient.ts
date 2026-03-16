// src/application/use-cases/ListSimulationVersionsByClient.ts
import { IHistoriesRepository } from '@/domain/repositories/IHistoriesRepository';
import { ListSimulationVersionsByClientInput, SimulationHistoryListResponse } from '@/application/dtos/HistoryDTO';
import { IListSimulationVersionsByClientUseCase } from './interfaces/IHistoryUseCases';
import { historyToResponse } from './helpers/historyToResponse';

export class ListSimulationVersionsByClient implements IListSimulationVersionsByClientUseCase {
  constructor(
    private historiesRepository: IHistoriesRepository,
  ) {}

  async execute(input: ListSimulationVersionsByClientInput): Promise<SimulationHistoryListResponse> {
    // Buscar todas as versões de simulações para o cliente
    const histories = await this.historiesRepository.findByClientId(input.id);

    // Ordenar por nome ascendente, depois por versão descendente
    histories.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return b.version - a.version;
    });

    // Converter para response
    return histories.map(historyToResponse);
  }
}