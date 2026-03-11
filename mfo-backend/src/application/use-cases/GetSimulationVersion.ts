// src/application/use-cases/GetSimulationVersion.ts

import { IHistoriesRepository } from '@/domain/repositories/IHistoriesRepository';
import { IGetSimulationVersionUseCase } from './interfaces/IHistoryUseCases';
import {
  GetSimulationVersionInput,
  SimulationHistoryResponse,
} from '@/application/dtos/HistoryDTO';
import { historyToResponse } from './helpers/historyToResponse';

export class GetSimulationVersion implements IGetSimulationVersionUseCase {
  constructor(private historiesRepository: IHistoriesRepository) {}

  async execute(input: GetSimulationVersionInput): Promise<SimulationHistoryResponse> {
    const history = await this.historiesRepository.findById(input.id);
    if (!history) {
      throw new Error('Simulation version not found.');
    }

    return historyToResponse(history);
  }
}

