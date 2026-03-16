// src/application/use-cases/interfaces/IAllocationUseCases.ts

import {
  CreateAllocationInput,
  AllocationResponse,
  ListClientAllocationsInput,
  AllocationListResponse,
  GetAllocationByIdInput,
  DeleteAllocationInput,
  UpdateAllocationInput,
} from '@/application/dtos/AllocationDTO';

export interface ICreateAllocationUseCase {
  execute(input: CreateAllocationInput): Promise<AllocationResponse>;
}

export interface IListClientAllocationsUseCase {
  execute(input: ListClientAllocationsInput): Promise<AllocationListResponse>;
}

export interface IGetAllocationByIdUseCase {
  execute(input: GetAllocationByIdInput): Promise<AllocationResponse>;
}

export interface IUpdateAllocationUseCase {
  execute(allocationId: string, input: UpdateAllocationInput): Promise<AllocationResponse>;
}

export interface IDeleteAllocationUseCase {
  execute(input: DeleteAllocationInput): Promise<void>;
}