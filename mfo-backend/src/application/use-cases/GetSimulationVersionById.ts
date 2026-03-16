// src/application/use-cases/GetSimulationVersionById.ts

import { PrismaHistoriesRepository } from '@/infrastructure/database/prisma/PrismaHistoriesRepository';

export class GetSimulationVersionById {
  constructor(private historiesRepository: PrismaHistoriesRepository) {}

  async execute(versionId: string) {
    const version = await this.historiesRepository.findById(versionId);

    if (!version) {
      throw new Error(`Versão de simulação com ID ${versionId} não encontrada`);
    }

    return version;
  }
}