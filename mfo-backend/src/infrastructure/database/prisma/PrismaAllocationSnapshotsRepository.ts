// src/infrastructure/database/prisma/PrismaAllocationSnapshotsRepository.ts
import { prisma } from './prismaClient';
import { AllocationSnapshot } from '@/domain/entities/AllocationSnapshot';
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository';

export class PrismaAllocationSnapshotsRepository implements IAllocationSnapshotsRepository {
  async findById(id: string): Promise<AllocationSnapshot | null> {
    const snapshot = await prisma.snapshot.findUnique({
      where: { id },
    });
    if (!snapshot) return null;
    return new AllocationSnapshot({
      id: snapshot.id,
      clientId: snapshot.clientId,
      date: snapshot.date,
      totalValue: snapshot.totalValue,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }

  async findByClientId(clientId: string): Promise<AllocationSnapshot[]> {
    const snapshots = await prisma.snapshot.findMany({
      where: { clientId },
      orderBy: { date: 'desc' },
    });
    return snapshots.map(snapshot => new AllocationSnapshot({
      id: snapshot.id,
      clientId: snapshot.clientId,
      date: snapshot.date,
      totalValue: snapshot.totalValue,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    }));
  }

  async create(snapshot: AllocationSnapshot): Promise<AllocationSnapshot> {
    const created = await prisma.snapshot.create({
      data: {
        id: snapshot.id,
        clientId: snapshot.clientId,
        date: snapshot.date,
        totalValue: snapshot.totalValue,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
      },
    });
    return new AllocationSnapshot({
      id: created.id,
      clientId: created.clientId,
      date: created.date,
      totalValue: created.totalValue,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(snapshot: AllocationSnapshot): Promise<AllocationSnapshot> {
    const updated = await prisma.snapshot.update({
      where: { id: snapshot.id },
      data: {
        date: snapshot.date,
        totalValue: snapshot.totalValue,
        updatedAt: snapshot.updatedAt,
      },
    });
    return new AllocationSnapshot({
      id: updated.id,
      clientId: updated.clientId,
      date: updated.date,
      totalValue: updated.totalValue,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.snapshot.delete({
      where: { id },
    });
  }
}