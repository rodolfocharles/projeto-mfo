// src/application/use-cases/AuthenticateClient.ts

import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { IHashService } from '@/domain/services/IHashService';
import { ClientResponse } from '@/application/dtos/ClientDTO';
import { IAuthenticateClientUseCase } from './interfaces/IClientUseCases';

export class AuthenticateClient implements IAuthenticateClientUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private hashService: IHashService,
  ) {}

  async execute(email: string, password: string): Promise<ClientResponse> {
    const client = await this.clientRepository.findByEmail(email);
    if (!client) {
      throw new Error('Invalid credentials.');
    }

    // a própria entidade guarda o hash na propriedade _password. o repositório
    // converte o registro do Prisma em entidade, portanto o hash está disponível.
    const hashed = client.password || '';
    const ok = await this.hashService.compare(password, hashed);
    if (!ok) {
      throw new Error('Invalid credentials.');
    }

    // aqui retornamos o cliente para que o controlador possa criar o JWT
    return client;
  }
}
