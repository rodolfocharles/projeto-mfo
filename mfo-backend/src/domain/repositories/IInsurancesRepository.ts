// src/domain/repositories/IInsurancesRepository.ts

import { Insurance } from '../entities/Insurance'

export interface IInsurancesRepository {
  findById(id: string): Promise<Insurance | null>
  findByClientId(clientId: string): Promise<Insurance[]>
  create(insurance: Insurance): Promise<Insurance>
  update(insurance: Insurance): Promise<Insurance>
  delete(id: string): Promise<void>
}