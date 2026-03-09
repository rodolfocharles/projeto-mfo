// src/application/use-cases/interfaces/IClientUseCases.ts

import { ClientResponse } from '@/application/dtos/ClientDTO';
import { CreateClientInput } from '@/application/dtos/ClientDTO';
import { UpdateClientInput } from '@/application/dtos/ClientDTO';

export interface ICreateClientUseCase {
  execute(input: CreateClientInput): Promise<ClientResponse>;
}

export interface IUpdateClientUseCase {
  execute(id: string, input: UpdateClientInput): Promise<ClientResponse>;
}

export interface IGetClientByIdUseCase {
  execute(id: string): Promise<ClientResponse>;
}

export interface IListClientsUseCase {
  execute(): Promise<ClientResponse[]>;
}

export interface IDeleteClientUseCase {
  execute(id: string): Promise<void>;
}

// interface responsável por autenticar um cliente — o caso de uso retorna o cliente
// caso as credenciais sejam válidas. A responsabilidade de gerar o JWT fica na
// camada de infraestrutura (controlador) para manter o caso de uso desacoplado.
export interface IAuthenticateClientUseCase {
  execute(email: string, password: string): Promise<ClientResponse>;
}