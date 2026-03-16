// src/application/use-cases/UpdateMovement.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IUpdateMovementUseCase } from './interfaces/IMovementUseCases'
import { UpdateMovementInput, MovementResponse } from '@/application/dtos/MovementDTO'
import { movementToResponse } from './helpers/movementToResponse'

export class UpdateMovement implements IUpdateMovementUseCase {
  constructor(private movementsRepository: IMovementsRepository) {}

  async execute(id: string, data: UpdateMovementInput): Promise<MovementResponse> {
    const movement = await this.movementsRepository.findById(id)
    if (!movement) throw new Error('Movement not found.')

    const updates: any = {}
    if (data.name !== undefined) updates.name = data.name
    if (data.type !== undefined) updates.type = data.type
    if (data.value !== undefined) updates.value = data.value
    if (data.startDate !== undefined) {
      updates.startDate = new Date(data.startDate)
    }
    if (data.endDate !== undefined) {
      updates.endDate = data.endDate ? new Date(data.endDate) : null
    }
    if (data.frequency !== undefined) updates.frequency = data.frequency
    if (data.isRecurrent !== undefined) updates.isRecurrent = data.isRecurrent
    if (data.isIndexed !== undefined) updates.isIndexed = data.isIndexed
    if (data.indexationRate !== undefined) updates.indexationRate = data.indexationRate

    movement.updateDetails(updates)

    const updated = await this.movementsRepository.update(movement)
    return movementToResponse(updated)
  }
}