// src/application/use-cases/UpdateMovement.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IUpdateMovementUseCase } from './interfaces/IMovementUseCases'
import { UpdateMovement as UpdateMovementDTO, MovementResponse } from '@/application/dtos/MovementDTO'
import { movementToResponse } from './helpers/movementToResponse'

export class UpdateMovement implements IUpdateMovementUseCase {
  constructor(private movementsRepository: IMovementsRepository) {}

  async execute(id: string, data: UpdateMovementDTO): Promise<MovementResponse> {
    const movement = await this.movementsRepository.findById(id)
    if (!movement) throw new Error('Movement not found.')

    // ✅ Agora o método existe na entidade
    movement.updateDetails({
      name: data.name,
      type: data.type,
      value: data.value,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      frequency: data.frequency,
      isRecurrent: data.isRecurrent,
      isIndexed: data.isIndexed,
      indexationRate: data.indexationRate,
    })

    const updated = await this.movementsRepository.update(movement)
    return movementToResponse(updated)
  }
}