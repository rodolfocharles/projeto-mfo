// src/domain/repositories/IMovementsRepository.ts

import { Movement } from '../entities/Movement'

export interface IMovementsRepository {
  findById(id: string): Promise<Movement | null>
  findByClientId(clientId: string): Promise<Movement[]>
  findByClientIdAndType(clientId: string, type: string): Promise<Movement[]>
  create(movement: Movement): Promise<Movement>
  update(movement: Movement): Promise<Movement>
  delete(id: string): Promise<void>
}