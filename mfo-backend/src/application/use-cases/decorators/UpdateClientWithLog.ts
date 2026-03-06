// src/application/use-cases/decorators/UpdateClientWithLog.ts

import { IUpdateClientUseCase } from '../interfaces/IClientUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { UpdateClientInput, ClientResponse } from '@/application/dtos/ClientDTO'

export class UpdateClientWithLog implements IUpdateClientUseCase {
  constructor(
    private updateClient: IUpdateClientUseCase,
    private logger: ILogger,
  ) {}

  async execute(id: string, input: UpdateClientInput): Promise<ClientResponse> {
    try {
      return await this.updateClient.execute(id, input)
    } catch (error: any) {
      this.logger.error(
        `[UpdateClient] Falha ao atualizar cliente ${id}: ${error.message}`,
        { clientId: id, error }
      )
      throw error
    }
  }
}