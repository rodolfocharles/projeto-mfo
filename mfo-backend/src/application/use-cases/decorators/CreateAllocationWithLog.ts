// src/application/use-cases/decorators/CreateAllocationWithLog.ts

import { ICreateAllocationUseCase } from '../interfaces/IAllocationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateAllocationInput, AllocationResponse } from '@/application/dtos/AllocationDTO'

export class CreateAllocationWithLog implements ICreateAllocationUseCase {
  constructor(
    private createAllocation: ICreateAllocationUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateAllocationInput): Promise<AllocationResponse> {
    try {
      return await this.createAllocation.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateAllocation] Falha ao criar alocação para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, allocationName: input.name, error }
      )
      throw error
    }
  }
}