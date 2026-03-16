// src/application/use-cases/CreateMovement.ts

import { randomUUID } from 'crypto'
import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { Movement } from '@/domain/entities/Movement'
import { CreateMovementInput, MovementResponse } from '@/application/dtos/MovementDTO'
import { movementToResponse } from './helpers/movementToResponse'

export class CreateMovement {
  constructor(
    private movementsRepository: IMovementsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: CreateMovementInput): Promise<MovementResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const isRecurrent = input.frequency === 'MONTHLY' || input.frequency === 'YEARLY'

    const movement = Movement.create({
      id: randomUUID(),
      clientId: input.clientId,
      name: input.name,
      type: input.type,
      value: input.value,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      frequency: input.frequency,
      isRecurrent,
      isIndexed: input.isIndexed ?? false,
      indexationRate: input.indexationRate ?? null,
      createdAt: new Date(),
    })

    const created = await this.movementsRepository.create(movement)

    return movementToResponse(created)
  }

}