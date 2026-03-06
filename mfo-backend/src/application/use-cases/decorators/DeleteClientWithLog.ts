// src/application/use-cases/decorators/DeleteClientWithLog.ts

import { IDeleteClientUseCase } from '../interfaces/IClientUseCases'
import { ILogger } from '@/domain/services/ILogger'

export class DeleteClientWithLog implements IDeleteClientUseCase {
  constructor(
    private deleteClient: IDeleteClientUseCase,
    private logger: ILogger,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      await this.deleteClient.execute(id)
    } catch (error: any) {
      this.logger.error(
        `[DeleteClient] Falha ao deletar cliente ${id}: ${error.message}`,
        { clientId: id, error }
      )
      throw error
    }
  }
}