// src/infrastructure/repositories/PrismaAllocationSnapshotsRepository.ts
import { prisma } from '@/infrastructure/database/prisma/prismaClient'
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository'
import { AllocationSnapshot } from '@/domain/entities/AllocationSnapshot'

export class PrismaAllocationSnapshotsRepository implements IAllocationSnapshotsRepository {
  async findById(id: string): Promise<AllocationSnapshot | null> {
    try {
      const snapshot = await prisma.allocationSnapshot.findUnique({
        where: { id },
      })
      return snapshot ? this.toDomain(snapshot) : null
    } catch (error) {
      console.error('Error finding snapshot by id:', error)
      throw error
    }
  }

  async findByClientId(clientId: string): Promise<AllocationSnapshot[]> {
    try {
      const snapshots = await prisma.allocationSnapshot.findMany({
        where: { clientId },
        orderBy: { date: 'desc' },
      })
      return snapshots.map(s => this.toDomain(s))
    } catch (error) {
      console.error('Error finding snapshots by clientId:', error)
      throw error
    }
  }

  async findLatestByClientId(clientId: string): Promise<AllocationSnapshot | null> {
    try {
      const snapshot = await prisma.allocationSnapshot.findFirst({
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

  async create(snapshot: AllocationSnapshot): Promise<AllocationSnapshot> {
    try {
      const created = await prisma.allocationSnapshot.create({
        data: {
          id: snapshot.id,
          clientId: snapshot.clientId,
          date: snapshot.date,
          totalValue: snapshot.totalValue,
          financialValue: snapshot.financialValue,
          immobilizedValue: snapshot.immobilizedValue,
          monthlyInterestRate: snapshot.monthlyInterestRate,
          monthlyInflationRate: snapshot.monthlyInflationRate,
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

  async update(id: string, snapshot: Partial<AllocationSnapshot>): Promise<AllocationSnapshot> {
    try {
      const updated = await prisma.allocationSnapshot.update({
        where: { id },
        data: {
          totalValue: snapshot.totalValue,
          financialValue: snapshot.financialValue,
          immobilizedValue: snapshot.immobilizedValue,
          monthlyInterestRate: snapshot.monthlyInterestRate,
          monthlyInflationRate: snapshot.monthlyInflationRate,
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
      await prisma.allocationSnapshot.delete({
        where: { id },
      })
    } catch (error) {
      console.error('Error deleting snapshot:', error)
      throw error
    }
  }

  private toDomain(raw: any): AllocationSnapshot {
    return AllocationSnapshot.create({
      id: raw.id,
      clientId: raw.clientId,
      date: raw.date,
      totalValue: raw.totalValue,
      financialValue: raw.financialValue,
      immobilizedValue: raw.immobilizedValue,
      monthlyInterestRate: raw.monthlyInterestRate,
      monthlyInflationRate: raw.monthlyInflationRate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}