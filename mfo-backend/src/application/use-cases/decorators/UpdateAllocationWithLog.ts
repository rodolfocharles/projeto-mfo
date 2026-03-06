// src/application/use-cases/decorators/UpdateAllocationWithLog.ts

import { IUpdateAllocationUseCase } from '../interfaces/IAllocationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { UpdateAllocationInput, AllocationResponse } from '@/application/dtos/AllocationDTO'

export class UpdateAllocationWithLog implements IUpdateAllocationUseCase {
  constructor(
    private updateAllocation: IUpdateAllocationUseCase,
    private logger: ILogger,
  ) {}

  async execute(allocationId: string, input: UpdateAllocationInput): Promise<AllocationResponse> {
    try {
      return await this.updateAllocation.execute(allocationId, input)
    } catch (error: any) {
      this.logger.error(
        `[UpdateAllocation] Falha ao atualizar alocação ${allocationId}: ${error.message}`,
        { allocationId, error }
      )
      throw error
    }
  }
}