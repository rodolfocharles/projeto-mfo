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