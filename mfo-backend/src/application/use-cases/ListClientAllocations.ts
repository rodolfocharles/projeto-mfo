// src/application/use-cases/ListClientAllocations.ts
import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { ListClientAllocationsInput, AllocationListResponse } from '@/application/dtos/AllocationDTO';
import { IListClientAllocationsUseCase } from './interfaces/IAllocationUseCases';
import { allocationToResponse } from './helpers/allocationToResponse';

export class ListClientAllocations implements IListClientAllocationsUseCase {
  constructor(
    private allocationsRepository: IAllocationsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute({ clientId }: ListClientAllocationsInput): Promise<AllocationListResponse> {
    const clientExists = await this.clientRepository.findById(clientId);
    if (!clientExists) {
      throw new Error('Client not found.');
    }

    const allocations = await this.allocationsRepository.findByClientId(clientId);

    return allocations.map(allocationToResponse)
  }
}