// src/application/use-cases/DeleteAllocation.ts

import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { IDeleteAllocationUseCase } from './interfaces/IAllocationUseCases';
import { DeleteAllocationInput } from '@/application/dtos/AllocationDTO';

export class DeleteAllocation implements IDeleteAllocationUseCase {
  constructor(private allocationsRepository: IAllocationsRepository) {}

  async execute(input: DeleteAllocationInput): Promise<void> {
    const allocation = await this.allocationsRepository.findById(input.allocationId);
    if (!allocation) throw new Error('Allocation not found.');
    await this.allocationsRepository.delete(input.allocationId);
  }
}