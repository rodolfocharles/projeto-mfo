// src/infrastructure/repositories/PrismaSnapshotsRepository.ts
import { prisma } from '@/infrastructure/database/prisma/prismaClient'
import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { Snapshot } from '@/domain/entities/Snapshot'

export class PrismaSnapshotsRepository implements ISnapshotsRepository {
  async findById(id: string): Promise<Snapshot | null> {
    try {
      const snapshot = await prisma.snapshot.findUnique({
        where: { id },
      })
      return snapshot ? this.toDomain(snapshot) : null
    } catch (error) {
      console.error('Error finding snapshot by id:', error)
      throw error
    }
  }

  async findByClientId(clientId: string): Promise<Snapshot[]> {
    try {
      const snapshots = await prisma.snapshot.findMany({
        where: { clientId },
        orderBy: { date: 'desc' },
      })
      return snapshots.map(s => this.toDomain(s))
    } catch (error) {
      console.error('Error finding snapshots by clientId:', error)
      throw error
    }
  }

  async findLatestByClientId(clientId: string): Promise<Snapshot | null> {
    try {
      const snapshot = await prisma.snapshot.findFirst({
        where: { clientId },
        orderBy: { date: 'desc' },
        take: 1,
      })
      return snapshot ? this.toDomain(snapshot) : null
    } catch (error) {
      console.error('Error finding latest snapshot by clientId:', error)
      throw error
    }
  }

  async create(snapshot: Snapshot): Promise<Snapshot> {
    try {
      const created = await prisma.snapshot.create({
        data: {
          id: snapshot.id,
          clientId: snapshot.clientId,
          date: snapshot.date,
          name: snapshot.name,
          financialTotal: snapshot.financialTotal,
          immobilizedTotal: snapshot.immobilizedTotal,
          totalValue: snapshot.totalValue,
          createdAt: snapshot.createdAt,
          updatedAt: snapshot.updatedAt,
        },
      })
      return this.toDomain(created)
    } catch (error) {
      console.error('Error creating snapshot:', error)
      throw error
    }
  }

  async update(id: string, snapshot: Partial<Snapshot>): Promise<Snapshot> {
    try {
      const updated = await prisma.snapshot.update({
        where: { id },
        data: {
          financialTotal: snapshot.financialTotal,
          immobilizedTotal: snapshot.immobilizedTotal,
          totalValue: snapshot.totalValue,
          updatedAt: new Date(),
        },
      })
      return this.toDomain(updated)
    } catch (error) {
      console.error('Error updating snapshot:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.snapshot.delete({
        where: { id },
      })
    } catch (error) {
      console.error('Error deleting snapshot:', error)
      throw error
    }
  }

  private toDomain(raw: any): Snapshot {
    return Snapshot.create({
      id: raw.id,
      clientId: raw.clientId,
      date: raw.date,
      name: raw.name,
      financialTotal: raw.financialTotal,
      immobilizedTotal: raw.immobilizedTotal,
      totalValue: raw.totalValue,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}