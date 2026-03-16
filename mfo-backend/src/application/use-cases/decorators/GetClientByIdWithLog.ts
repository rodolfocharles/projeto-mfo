// src/application/use-cases/decorators/GetClientByIdWithLog.ts

import { IGetClientByIdUseCase } from '../interfaces/IClientUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ClientResponse } from '@/application/dtos/ClientDTO'

export class GetClientByIdWithLog implements IGetClientByIdUseCase {
  constructor(
    private getClientById: IGetClientByIdUseCase,
    private logger: ILogger,
  ) {}

  async execute(id: string): Promise<ClientResponse> {
    try {
      return await this.getClientById.execute(id)
    } catch (error: any) {
      this.logger.error(
        `[GetClientById] Falha ao buscar cliente ${id}: ${error.message}`,
        { clientId: id, error }
      )
      throw error
    }
  }
}