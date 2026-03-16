// src/application/use-cases/decorators/ListClientAllocationSnapshotsWithLog.ts

import { IListClientAllocationSnapshotsUseCase } from '../interfaces/IAllocationSnapshotUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ListClientAllocationSnapshotsInput, AllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO'

export class ListClientAllocationSnapshotsWithLog implements IListClientAllocationSnapshotsUseCase {
  constructor(
    private listClientAllocationSnapshots: IListClientAllocationSnapshotsUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: ListClientAllocationSnapshotsInput): Promise<AllocationSnapshotResponse[]> {
    try {
      return await this.listClientAllocationSnapshots.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[ListClientAllocationSnapshots] Falha ao listar snapshots para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, error }
      )
      throw error
    }
  }
}