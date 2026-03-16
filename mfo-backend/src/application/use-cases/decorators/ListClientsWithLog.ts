// src/application/use-cases/decorators/ListClientsWithLog.ts

import { IListClientsUseCase } from '../interfaces/IClientUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ClientListResponse } from '@/application/dtos/ClientDTO'

export class ListClientsWithLog implements IListClientsUseCase {
  constructor(
    private listClients: IListClientsUseCase,
    private logger: ILogger,
  ) {}

  async execute(): Promise<ClientListResponse> {
    try {
      return await this.listClients.execute()
    } catch (error: any) {
      this.logger.error(
        `[ListClients] Falha ao listar clientes: ${error.message}`,
        { error }
      )
      throw error
    }
  }
}