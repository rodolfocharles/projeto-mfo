// src/application/use-cases/GetAllocationSnapshotById.ts
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository';
import { IAllocationSnapshotItemsRepository } from '@/domain/repositories/IAllocationSnapshotItemsRepository';
import { GetAllocationSnapshotByIdInput, FullAllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO';
import { IGetAllocationSnapshotByIdUseCase } from './interfaces/IAllocationSnapshotUseCases';
import { allocationSnapshotToResponse } from './helpers/allocationSnapshotToResponse';

export class GetAllocationSnapshotById implements IGetAllocationSnapshotByIdUseCase {
  constructor(
    private allocationSnapshotsRepository: IAllocationSnapshotsRepository,
    private allocationSnapshotItemsRepository: IAllocationSnapshotItemsRepository,
  ) {}

  async execute(input: GetAllocationSnapshotByIdInput): Promise<FullAllocationSnapshotResponse> {
    // 1. Buscar o snapshot
    const snapshot = await this.allocationSnapshotsRepository.findById(input.snapshotId);
    if (!snapshot) {
      throw new Error('Allocation snapshot not found.');
    }

    // 2. Buscar os itens do snapshot
    const items = await this.allocationSnapshotItemsRepository.findBySnapshotId(snapshot.id);

    // 3. Retornar no formato FullAllocationSnapshotResponse
    return allocationSnapshotToResponse(snapshot, items);
  }
}