// src/application/use-cases/UpdateClient.ts

import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { IUpdateClientUseCase } from './interfaces/IClientUseCases'
import { UpdateClientInput, ClientInternalResponse } from '@/application/dtos/ClientDTO'
import { clientToResponse } from './helpers/clientToResponse'

export class UpdateClient implements IUpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string, input: UpdateClientInput): Promise<ClientInternalResponse> {
    const client = await this.clientRepository.findById(id)
    if (!client) throw new Error('Client not found.')

    if (input.name !== undefined) {
      client.updateName(input.name)
    }
    if (input.email !== undefined) {
      client.updateEmail(input.email)
    }
    if (input.phone !== undefined) {
      client.updatePhone(input.phone)
    }
    if (input.address !== undefined) {
      client.updateAddress(input.address)
    }

    const updated = await this.clientRepository.update(client)
    return clientToResponse(updated)
  }
}