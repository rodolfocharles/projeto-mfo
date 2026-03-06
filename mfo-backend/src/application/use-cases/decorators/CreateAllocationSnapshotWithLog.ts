// src/application/use-cases/decorators/CreateAllocationSnapshotWithLog.ts

import { ICreateAllocationSnapshotUseCase } from '../interfaces/IAllocationSnapshotUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateAllocationSnapshotInput, FullAllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO'

export class CreateAllocationSnapshotWithLog implements ICreateAllocationSnapshotUseCase {
  constructor(
    private createAllocationSnapshot: ICreateAllocationSnapshotUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateAllocationSnapshotInput): Promise<FullAllocationSnapshotResponse> {
    try {
      return await this.createAllocationSnapshot.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateAllocationSnapshot] Falha ao criar snapshot de alocações para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, date: input.date, error }
      )
      throw error
    }
  }
}