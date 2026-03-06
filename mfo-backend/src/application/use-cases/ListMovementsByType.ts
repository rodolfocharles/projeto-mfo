// src/application/use-cases/ListMovementsByType.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { IListMovementsByTypeUseCase } from './interfaces/IMovementUseCases'
import { ListMovementsByTypeInput, MovementListResponse, MovementResponse } from '@/application/dtos/MovementDTO'
import { Movement } from '@/domain/entities/Movement'

export class ListMovementsByType implements IListMovementsByTypeUseCase {
  constructor(
    private movementsRepository: IMovementsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: ListMovementsByTypeInput): Promise<MovementListResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const movements = await this.movementsRepository.findByClientIdAndType(
      input.clientId,
      input.type,
    )

    return movements.map(this.toResponse)
  }

  private toResponse(m: Movement): MovementResponse {
    return {
      id: m.id,
      clientId: m.clientId,
      name: m.name,
      type: m.type,
      value: m.value,
      startDate: m.startDate.toISOString(),
      endDate: m.endDate ? m.endDate.toISOString() : null,
      frequency: m.frequency,
      isRecurrent: m.isRecurrent,
      isIndexed: m.isIndexed,
      indexationRate: m.indexationRate ?? null,
      createdAt: m.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: m.updatedAt ? m.updatedAt.toISOString() : null,
    }
  }
}