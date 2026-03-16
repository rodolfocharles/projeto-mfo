// src/application/use-cases/decorators/GetAllocationSnapshotByIdWithLog.ts

import { IGetAllocationSnapshotByIdUseCase } from '../interfaces/IAllocationSnapshotUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { GetAllocationSnapshotByIdInput, FullAllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO'

export class GetAllocationSnapshotByIdWithLog implements IGetAllocationSnapshotByIdUseCase {
  constructor(
    private getAllocationSnapshotById: IGetAllocationSnapshotByIdUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: GetAllocationSnapshotByIdInput): Promise<FullAllocationSnapshotResponse> {
    try {
      return await this.getAllocationSnapshotById.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[GetAllocationSnapshotById] Falha ao buscar snapshot ${input.snapshotId}: ${error.message}`,
        { snapshotId: input.snapshotId, error }
      )
      throw error
    }
  }
}