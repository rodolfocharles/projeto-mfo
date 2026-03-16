// src/application/use-cases/ListClients.ts

import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { ClientResponse } from '@/application/dtos/ClientDTO';
import { IListClientsUseCase } from './interfaces/IClientUseCases';
import { clientToResponse } from './helpers/clientToResponse';

export class ListClients implements IListClientsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(): Promise<ClientResponse[]> {
    const clients = await this.clientRepository.findAll();
    return clients.map(clientToResponse)
  }
}