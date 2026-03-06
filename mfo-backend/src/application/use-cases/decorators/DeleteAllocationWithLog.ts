// src/application/use-cases/decorators/DeleteAllocationWithLog.ts

import { IDeleteAllocationUseCase } from '../interfaces/IAllocationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { DeleteAllocationInput } from '@/application/dtos/AllocationDTO'

export class DeleteAllocationWithLog implements IDeleteAllocationUseCase {
  constructor(
    private deleteAllocation: IDeleteAllocationUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: DeleteAllocationInput): Promise<void> {
    try {
      await this.deleteAllocation.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[DeleteAllocation] Falha ao deletar alocação ${input.allocationId}: ${error.message}`,
        { allocationId: input.allocationId, error }
      )
      throw error
    }
  }
}