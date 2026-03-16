// src/application/use-cases/decorators/GetSimulationVersionWithLog.ts

import { GetSimulationVersionById } from '../GetSimulationVersionById';
import { ILogger } from '@/infrastructure/services/ILogger';

export class GetSimulationVersionWithLog {
  constructor(
    private getSimulationVersionUseCase: GetSimulationVersionById,
    private logger: ILogger,
  ) {}

  async execute(versionId: string) {
    this.logger.log(`[GetSimulationVersionWithLog] Buscando versão de simulação com ID: ${versionId}`);

    try {
      const result = await this.getSimulationVersionUseCase.execute(versionId);
      this.logger.log(`[GetSimulationVersionWithLog] Versão encontrada com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`[GetSimulationVersionWithLog] Erro ao buscar versão: ${(error as Error).message}`);
      throw error;
    }
  }
}