// src/application/use-cases/ListClientAllocationSnapshots.ts
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository';
import { ListClientAllocationSnapshotsInput, AllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO';
import { IListClientAllocationSnapshotsUseCase } from './interfaces/IAllocationSnapshotUseCases';

export class ListClientAllocationSnapshots implements IListClientAllocationSnapshotsUseCase {
  constructor(
    private allocationSnapshotsRepository: IAllocationSnapshotsRepository,
  ) {}

  async execute(input: ListClientAllocationSnapshotsInput): Promise<AllocationSnapshotResponse[]> {
    // Buscar snapshots do cliente
    const snapshots = await this.allocationSnapshotsRepository.findByClientId(input.clientId);

    // Converter para response (sem itens, apenas snapshot básico)
    return snapshots.map(snapshot => ({
      id: snapshot.id,
      clientId: snapshot.clientId,
      date: snapshot.date.toISOString(),
      totalValue: snapshot.totalValue,
      createdAt: snapshot.createdAt.toISOString(),
      updatedAt: snapshot.updatedAt ? snapshot.updatedAt.toISOString() : null,
    }));
  }
}