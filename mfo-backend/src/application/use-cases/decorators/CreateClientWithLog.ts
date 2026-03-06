// src/application/use-cases/decorators/CreateClientWithLog.ts

import { ICreateClientUseCase } from '../interfaces/IClientUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateClientInput, ClientResponse } from '@/application/dtos/ClientDTO'

export class CreateClientWithLog implements ICreateClientUseCase {
  constructor(
    private createClient: ICreateClientUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateClientInput): Promise<ClientResponse> {
    try {
      return await this.createClient.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateClient] Falha ao criar cliente com email ${input.email}: ${error.message}`,
        { email: input.email, error }
      )
      throw error
    }
  }
}