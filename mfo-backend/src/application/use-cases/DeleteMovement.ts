// src/application/use-cases/DeleteMovement.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'

export class DeleteMovement {
  constructor(private movementsRepository: IMovementsRepository) {}

  async execute(id: string): Promise<void> {
    const movement = await this.movementsRepository.findById(id)
    if (!movement) throw new Error('Movement not found.')
    await this.movementsRepository.delete(id)
  }
}