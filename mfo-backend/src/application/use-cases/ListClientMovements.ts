// src/application/use-cases/ListClientMovements.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { MovementListResponse, MovementResponse } from '@/application/dtos/MovementDTO'
import { Movement } from '@/domain/entities/Movement'
import { movementToResponse } from './helpers/movementToResponse'

export class ListClientMovements {
  constructor(
    private movementsRepository: IMovementsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(clientId: string): Promise<MovementListResponse> {
    const client = await this.clientRepository.findById(clientId)
    if (!client) throw new Error('Client not found.')

    const movements = await this.movementsRepository.findByClientId(clientId)
    return movements.map(movementToResponse)
  }
}