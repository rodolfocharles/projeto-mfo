// src/application/use-cases/GetClientById.ts

import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { ClientInternalResponse, ClientResponse } from '@/application/dtos/ClientDTO';
import { IGetClientByIdUseCase } from './interfaces/IClientUseCases';
import { clientToResponse } from './helpers/clientToResponse';

export class GetClientById implements IGetClientByIdUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<ClientInternalResponse> {
    const client = await this.clientRepository.findById(id)
    if (!client) throw new Error('Client not found.')
    return clientToResponse(client)
  }
}