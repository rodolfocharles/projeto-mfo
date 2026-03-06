// src/application/use-cases/helpers/allocationSnapshotToResponse.ts

import { AllocationSnapshot } from '@/domain/entities/AllocationSnapshot';
import { AllocationSnapshotItem } from '@/domain/entities/AllocationSnapshotItem';
import { FullAllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO';

export function allocationSnapshotToResponse(snapshot: AllocationSnapshot, items: AllocationSnapshotItem[]): FullAllocationSnapshotResponse {
  return {
    id: snapshot.id,
    clientId: snapshot.clientId,
    date: snapshot.date.toISOString(),
    totalValue: snapshot.totalValue,
    createdAt: snapshot.createdAt.toISOString(),
    updatedAt: snapshot.updatedAt ? snapshot.updatedAt.toISOString() : null,
    allocationSnapshots: items.map(item => ({
      id: item.id,
      snapshotId: item.snapshotId,
      allocationId: item.allocationId,
      valueAtSnapshot: item.valueAtSnapshot,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    })),
  };
}