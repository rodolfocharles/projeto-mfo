// src/application/use-cases/GetMovementById.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IGetMovementByIdUseCase } from './interfaces/IMovementUseCases'
import { MovementResponse } from '@/application/dtos/MovementDTO'
import { movementToResponse } from './helpers/movementToResponse'

export class GetMovementById implements IGetMovementByIdUseCase {
  constructor(private movementsRepository: IMovementsRepository) {}

  async execute(id: string): Promise<MovementResponse> {
    const movement = await this.movementsRepository.findById(id)
    if (!movement) throw new Error('Movement not found.')
    return movementToResponse(movement)
  }
}