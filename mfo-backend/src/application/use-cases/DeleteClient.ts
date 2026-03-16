// src/application/use-cases/DeleteClient.ts

import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { IDeleteClientUseCase } from './interfaces/IClientUseCases';

export class DeleteClient implements IDeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(clientId: string): Promise<void> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) throw new Error('Client not found.');

    await this.clientRepository.delete(clientId);
  }
}