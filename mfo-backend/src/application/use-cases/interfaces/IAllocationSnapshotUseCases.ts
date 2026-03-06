// src/application/use-cases/interfaces/IAllocationSnapshotUseCases.ts

import {
  CreateAllocationSnapshotInput,
  AllocationSnapshotResponse,
  ListClientAllocationSnapshotsInput,
  FullAllocationSnapshotResponse,
  GetAllocationSnapshotByIdInput,
  DeleteAllocationSnapshotInput,
  UpdateAllocationSnapshotItemInput,
} from '@/application/dtos/AllocationSnapshotDTO';

export interface ICreateAllocationSnapshotUseCase {
  execute(input: CreateAllocationSnapshotInput): Promise<FullAllocationSnapshotResponse>;
}

export interface IListClientAllocationSnapshotsUseCase {
  execute(input: ListClientAllocationSnapshotsInput): Promise<AllocationSnapshotResponse[]>;
}

export interface IGetAllocationSnapshotByIdUseCase {
  execute(input: GetAllocationSnapshotByIdInput): Promise<FullAllocationSnapshotResponse>;
}

export interface IUpdateAllocationSnapshotItemUseCase {
  execute(snapshotId: string, itemId: string, input: UpdateAllocationSnapshotItemInput): Promise<void>;
}

export interface IDeleteAllocationSnapshotUseCase {
  execute(input: DeleteAllocationSnapshotInput): Promise<void>;
}