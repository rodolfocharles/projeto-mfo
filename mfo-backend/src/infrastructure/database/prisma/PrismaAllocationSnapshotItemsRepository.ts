// src/infrastructure/database/prisma/PrismaAllocationSnapshotItemsRepository.ts
import { prisma } from './prismaClient';
import { AllocationSnapshotItem } from '@/domain/entities/AllocationSnapshotItem';
import { IAllocationSnapshotItemsRepository } from '@/domain/repositories/IAllocationSnapshotItemsRepository';

export class PrismaAllocationSnapshotItemsRepository implements IAllocationSnapshotItemsRepository {
  async findById(id: string): Promise<AllocationSnapshotItem | null> {
    const item = await prisma.allocationSnapshotItem.findUnique({
      where: { id },
    });
    if (!item) return null;
    return new AllocationSnapshotItem({
      id: item.id,
      snapshotId: item.snapshotId,
      allocationId: item.allocationId,
      valueAtSnapshot: item.valueAtSnapshot,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }

  async findBySnapshotId(snapshotId: string): Promise<AllocationSnapshotItem[]> {
    const items = await prisma.allocationSnapshotItem.findMany({
      where: { snapshotId },
      orderBy: { createdAt: 'asc' },
    });
    return items.map(item => new AllocationSnapshotItem({
      id: item.id,
      snapshotId: item.snapshotId,
      allocationId: item.allocationId,
      valueAtSnapshot: item.valueAtSnapshot,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async create(item: AllocationSnapshotItem): Promise<AllocationSnapshotItem> {
    const created = await prisma.allocationSnapshotItem.create({
      data: {
        id: item.id,
        snapshotId: item.snapshotId,
        allocationId: item.allocationId,
        valueAtSnapshot: item.valueAtSnapshot,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
    return new AllocationSnapshotItem({
      id: created.id,
      snapshotId: created.snapshotId,
      allocationId: created.allocationId,
      valueAtSnapshot: created.valueAtSnapshot,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(item: AllocationSnapshotItem): Promise<AllocationSnapshotItem> {
    const updated = await prisma.allocationSnapshotItem.update({
      where: { id: item.id },
      data: {
        valueAtSnapshot: item.valueAtSnapshot,
        updatedAt: item.updatedAt,
      },
    });
    return new AllocationSnapshotItem({
      id: updated.id,
      snapshotId: updated.snapshotId,
      allocationId: updated.allocationId,
      valueAtSnapshot: updated.valueAtSnapshot,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.allocationSnapshotItem.delete({
      where: { id },
    });
  }
}