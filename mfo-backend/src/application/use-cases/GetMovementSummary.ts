// src/application/use-cases/GetMovementSummary.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { IGetMovementSummaryUseCase } from './interfaces/IMovementUseCases'
import { MovementSummaryInput, MovementSummaryResponse } from '@/application/dtos/MovementDTO'

export class GetMovementSummary implements IGetMovementSummaryUseCase {
  constructor(
    private movementsRepository: IMovementsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: MovementSummaryInput): Promise<MovementSummaryResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const movements = await this.movementsRepository.findByClientId(input.clientId)

    return {
      totalMovements: movements.length,
      income: movements
        .filter(m => m.type === 'INCOME')
        .reduce((sum, m) => sum + m.value, 0),
      expense: movements
        .filter(m => m.type === 'EXPENSE')
        .reduce((sum, m) => sum + m.value, 0),
      investment: movements
        .filter(m => m.type === 'INVESTMENT')
        .reduce((sum, m) => sum + m.value, 0),
      withdrawal: movements
        .filter(m => m.type === 'WITHDRAWAL')
        .reduce((sum, m) => sum + m.value, 0),
      recurrent: movements.filter(m => m.isRecurrent).length,
      oneTime: movements.filter(m => !m.isRecurrent).length,
    }
  }
}