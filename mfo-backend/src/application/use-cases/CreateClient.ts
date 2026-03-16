// src/application/use-cases/CreateClient.ts

import { Client } from '@/domain/entities/Client';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { IHashService } from '@/domain/services/IHashService';
import { CreateClientInput, ClientResponse } from '@/application/dtos/ClientDTO';
import { ICreateClientUseCase } from './interfaces/IClientUseCases';
import { clientToResponse } from './helpers/clientToResponse';

export class CreateClient implements ICreateClientUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private hashService: IHashService,
  ) {}

  async execute(input: CreateClientInput): Promise<ClientResponse> {
    const existing = await this.clientRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already in use.');
    }

    const client = Client.create({
      name: input.name,
      email: input.email,
      birthDate: input.birthDate,
      lifeStatus: input.lifeStatus,
    });

    if (input.password) {
      const passwordHash = await this.hashService.hash(input.password);
      client.setPasswordHash(passwordHash);
    }

    const created = await this.clientRepository.create(client);

    return clientToResponse(created)
  }
}