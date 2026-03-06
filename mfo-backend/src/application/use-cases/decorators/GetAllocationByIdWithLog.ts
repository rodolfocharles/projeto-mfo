// src/application/use-cases/decorators/GetAllocationByIdWithLog.ts

import { IGetAllocationByIdUseCase } from '../interfaces/IAllocationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { GetAllocationByIdInput, AllocationResponse } from '@/application/dtos/AllocationDTO'

export class GetAllocationByIdWithLog implements IGetAllocationByIdUseCase {
  constructor(
    private getAllocationById: IGetAllocationByIdUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: GetAllocationByIdInput): Promise<AllocationResponse> {
    try {
      return await this.getAllocationById.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[GetAllocationById] Falha ao buscar alocação ${input.allocationId}: ${error.message}`,
        { allocationId: input.allocationId, error }
      )
      throw error
    }
  }
}