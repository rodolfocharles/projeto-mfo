// src/application/use-cases/GetAllocationById.ts

import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { IGetAllocationByIdUseCase } from './interfaces/IAllocationUseCases';
import { GetAllocationByIdInput, AllocationResponse } from '@/application/dtos/AllocationDTO';
import { allocationToResponse } from './helpers/allocationToResponse';

export class GetAllocationById implements IGetAllocationByIdUseCase {
  constructor(private allocationsRepository: IAllocationsRepository) {}

  async execute(input: GetAllocationByIdInput): Promise<AllocationResponse> {
    const allocation = await this.allocationsRepository.findById(input.allocationId);
    if (!allocation) throw new Error('Allocation not found.');
    return allocationToResponse(allocation);
  }
}