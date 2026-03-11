// src/application/use-cases/ListRealizedPatrimonyByClient.ts

import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository';
import { IAllocationSnapshotItemsRepository } from '@/domain/repositories/IAllocationSnapshotItemsRepository';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import {
  ListSimulationVersionsByClientInput,
  RealizedPatrimonyHistoryListResponse,
} from '@/application/dtos/HistoryDTO';
import { IListRealizedPatrimonyByClientUseCase } from './interfaces/IHistoryUseCases';

export class ListRealizedPatrimonyByClient implements IListRealizedPatrimonyByClientUseCase {
  constructor(
    private allocationSnapshotsRepository: IAllocationSnapshotsRepository,
    private allocationSnapshotItemsRepository: IAllocationSnapshotItemsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(
    input: ListSimulationVersionsByClientInput,
  ): Promise<RealizedPatrimonyHistoryListResponse> {
    const client = await this.clientRepository.findById(input.id);
    if (!client) {
      throw new Error('Client not found.');
    }

    const snapshots = await this.allocationSnapshotsRepository.findByClientId(input.id);

    // Ordenar por data crescente para histórico cronológico
    snapshots.sort((a, b) => a.date.getTime() - b.date.getTime());

    const result: RealizedPatrimonyHistoryListResponse = [];

    for (const snapshot of snapshots) {
      const items = await this.allocationSnapshotItemsRepository.findBySnapshotId(snapshot.id);

      result.push({
        id: snapshot.id,
        clientId: snapshot.clientId,
        date: snapshot.date.toISOString(),
        totalValue: snapshot.totalValue,
        createdAt: snapshot.createdAt.toISOString(),
        updatedAt: snapshot.updatedAt ? snapshot.updatedAt.toISOString() : null,
        allocationSnapshots: items.map((item) => ({
          id: item.id,
          snapshotId: item.snapshotId,
          allocationId: item.allocationId,
          valueAtSnapshot: item.valueAtSnapshot,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
        })),
      });
    }

    return result;
  }
}

