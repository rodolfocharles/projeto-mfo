// src/domain/repositories/ISimulationsRepository.ts

import { Simulation } from '../entities/Simulation'

export interface ISimulationsRepository {
  findById(id: string): Promise<Simulation | null>
  findByClientId(clientId: string): Promise<Simulation[]>
  findByClientIdAndName(clientId: string, name: string): Promise<Simulation[]>
  create(simulation: Simulation): Promise<Simulation>
  update(simulation: Simulation): Promise<Simulation>
  delete(id: string): Promise<void>
}