// src/application/use-cases/decorators/ListClientAllocationsWithLog.ts

import { IListClientAllocationsUseCase } from '../interfaces/IAllocationUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ListClientAllocationsInput, AllocationListResponse } from '@/application/dtos/AllocationDTO'

export class ListClientAllocationsWithLog implements IListClientAllocationsUseCase {
  constructor(
    private listClientAllocations: IListClientAllocationsUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: ListClientAllocationsInput): Promise<AllocationListResponse> {
    try {
      return await this.listClientAllocations.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[ListClientAllocations] Falha ao listar alocações do cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, error }
      )
      throw error
    }
  }
}