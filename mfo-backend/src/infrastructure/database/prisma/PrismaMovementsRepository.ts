// src/infrastructure/database/prisma/PrismaMovementsRepository.ts

import { prisma } from './prismaClient'
import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { Movement } from '@/domain/entities/Movement'

export class PrismaMovementsRepository implements IMovementsRepository {
  async findById(id: string): Promise<Movement | null> {
    const raw = await prisma.movement.findUnique({ where: { id } })
    if (!raw) return null
    return this.toEntity(raw)
  }

  async findByClientId(clientId: string): Promise<Movement[]> {
    const raws = await prisma.movement.findMany({
      where: { clientId },
      orderBy: { startDate: 'desc' },
    })
    return raws.map(raw => this.toEntity(raw))
  }

  async findByClientIdAndType(clientId: string, type: string): Promise<Movement[]> {
    const raws = await prisma.movement.findMany({
      where: {
        clientId,
        type: type.toUpperCase() as any,
      },
      orderBy: { startDate: 'desc' },
    })
    return raws.map(raw => this.toEntity(raw))
  }

  async create(movement: Movement): Promise<Movement> {
    const raw = await prisma.movement.create({
      data: {
        id: movement.id,
        clientId: movement.clientId,
        name: movement.name,
        type: movement.type,
        value: movement.value,
        startDate: movement.startDate,
        endDate: movement.endDate ?? null,
        frequency: movement.frequency,
        isRecurrent: movement.isRecurrent,
        isIndexed: movement.isIndexed,
        indexationRate: movement.indexationRate ?? null,
      },
    })
    return this.toEntity(raw)
  }

  async update(movement: Movement): Promise<Movement> {
    const raw = await prisma.movement.update({
      where: { id: movement.id },
      data: {
        name: movement.name,
        type: movement.type,
        value: movement.value,
        startDate: movement.startDate,
        endDate: movement.endDate ?? null,
        frequency: movement.frequency,
        isRecurrent: movement.isRecurrent,
        isIndexed: movement.isIndexed,
        indexationRate: movement.indexationRate ?? null,
        updatedAt: new Date(),
      },
    })
    return this.toEntity(raw)
  }

  async delete(id: string): Promise<void> {
    await prisma.movement.delete({ where: { id } })
  }

  private toEntity(raw: any): Movement {
    return Movement.create({
      id: raw.id,
      clientId: raw.clientId,
      name: raw.name,
      type: raw.type,
      value: raw.value,
      startDate: raw.startDate,
      endDate: raw.endDate ?? null,
      frequency: raw.frequency,
      isRecurrent: raw.isRecurrent,
      isIndexed: raw.isIndexed,
      indexationRate: raw.indexationRate ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? null,
    })
  }
}