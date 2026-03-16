// src/application/use-cases/UpdateAllocation.ts

import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { IUpdateAllocationUseCase } from './interfaces/IAllocationUseCases';
import { UpdateAllocationInput, AllocationResponse } from '@/application/dtos/AllocationDTO';
import { AllocationType } from '@/domain/value-objects/AllocationType';
import { allocationToResponse } from './helpers/allocationToResponse';

export class UpdateAllocation implements IUpdateAllocationUseCase {
  constructor(private allocationsRepository: IAllocationsRepository) {}

  async execute(allocationId: string, input: UpdateAllocationInput): Promise<AllocationResponse> {
    const allocation = await this.allocationsRepository.findById(allocationId);
    if (!allocation) throw new Error('Allocation not found.');

    // Atualiza detalhes principais se vier algum dos campos
    if (
      input.name !== undefined ||
      input.value !== undefined ||
      input.type !== undefined ||
      input.startDate !== undefined
    ) {
      allocation.updateDetails(
        input.name ?? allocation.name,
        input.value ?? allocation.value,
        (input.type as AllocationType) ?? allocation.type,
        input.startDate ? new Date(input.startDate) : allocation.startDate,
      );
    }

    // Atualiza detalhes financeiros se vier algum dos campos
    if (
      input.contribution !== undefined ||
      input.rate !== undefined ||
      input.isTaxable !== undefined
    ) {
      allocation.updateFinancialDetails(
        input.contribution ?? allocation.contribution,
        input.rate ?? allocation.rate,
        input.isTaxable ?? allocation.isTaxable,
      );
    }

    // Atualiza detalhes de financiamento se vier algum dos campos
    if (input.isFinanced !== undefined) {
      allocation.updateFinancingDetails(
        input.isFinanced,
        input.downPayment ?? allocation.downPayment,
        input.installments ?? allocation.installments,
        input.interestRate ?? allocation.interestRate,
      );
    }

    const updated = await this.allocationsRepository.update(allocation);
    return allocationToResponse(updated);
  }
}