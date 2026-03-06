// src/application/use-cases/CreateAllocation.ts
import { Allocation } from '@/domain/entities/Allocation';
import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { CreateAllocationInput, AllocationResponse } from '@/application/dtos/AllocationDTO';
import { ICreateAllocationUseCase } from './interfaces/IAllocationUseCases';
import { allocationToResponse } from './helpers/allocationToResponse'

export class CreateAllocation implements ICreateAllocationUseCase {
  constructor(
    private allocationsRepository: IAllocationsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(request: CreateAllocationInput): Promise<AllocationResponse> {
    // 1. Validar se o cliente existe
    const clientExists = await this.clientRepository.findById(request.clientId);
    if (!clientExists) {
      throw new Error('Client not found.');
    }

    // 2. Criar a entidade de domínio
    const allocation = Allocation.create({
      clientId: request.clientId,
      name: request.name,
      type: request.type,
      value: request.value,
      startDate: request.startDate,
      contribution: request.contribution,
      rate: request.rate,
      isTaxable: request.isTaxable,
      isFinanced: request.isFinanced,
      downPayment: request.downPayment,
      installments: request.installments,
      interestRate: request.interestRate,
    });

    // 3. Persistir
    const createdAllocation = await this.allocationsRepository.create(allocation)

    // 4. Retornar no formato AllocationResponse
    return allocationToResponse(createdAllocation)
  }
}