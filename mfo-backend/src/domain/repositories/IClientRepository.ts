// src/domain/repositories/IClientRepository.ts

import { Client } from '../entities/Client';

export interface IClientRepository {
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findAll(): Promise<Client[]>;          // ← adicionado
  create(client: Client): Promise<Client>;
  update(client: Client): Promise<Client>;
  delete(id: string): Promise<void>;
}