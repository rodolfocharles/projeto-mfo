// src/infrastructure/database/prisma/PrismaHistoriesRepository.ts
import { prisma } from './prismaClient';
import { History } from '@/domain/entities/History';
import { IHistoriesRepository } from '@/domain/repositories/IHistoriesRepository';

export class PrismaHistoriesRepository implements IHistoriesRepository {
  async findById(id: string): Promise<History | null> {
    const simulation = await prisma.simulation.findUnique({
      where: { id },
    });
    if (!simulation) return null;
    return new History({
      id: simulation.id,
      clientId: simulation.clientId,
      name: simulation.name,
      version: simulation.version,
      startDate: simulation.startDate,
      realRate: simulation.realRate,
      inflation: simulation.inflation,
      lifeStatus: simulation.lifeStatus,
      createdAt: simulation.createdAt,
      updatedAt: simulation.updatedAt,
    });
  }

  async findByClientId(clientId: string): Promise<History[]> {
    const simulations = await prisma.simulation.findMany({
      where: { clientId },
      orderBy: [
        { name: 'asc' },
        { version: 'desc' },
      ],
    });
    return simulations.map(simulation => new History({
      id: simulation.id,
      clientId: simulation.clientId,
      name: simulation.name,
      version: simulation.version,
      startDate: simulation.startDate,
      realRate: simulation.realRate,
      inflation: simulation.inflation,
      lifeStatus: simulation.lifeStatus,
      createdAt: simulation.createdAt,
      updatedAt: simulation.updatedAt,
    }));
  }

  async create(history: History): Promise<History> {
    const created = await prisma.simulation.create({
      data: {
        id: history.id,
        clientId: history.clientId,
        name: history.name,
        version: history.version,
        startDate: history.startDate,
        realRate: history.realRate,
        inflation: history.inflation,
        lifeStatus: history.lifeStatus,
        createdAt: history.createdAt,
        updatedAt: history.updatedAt,
      },
    });
    return new History({
      id: created.id,
      clientId: created.clientId,
      name: created.name,
      version: created.version,
      startDate: created.startDate,
      realRate: created.realRate,
      inflation: created.inflation,
      lifeStatus: created.lifeStatus,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(history: History): Promise<History> {
    const updated = await prisma.simulation.update({
      where: { id: history.id },
      data: {
        name: history.name,
        version: history.version,
        realRate: history.realRate,
        inflation: history.inflation,
        lifeStatus: history.lifeStatus,
        updatedAt: history.updatedAt,
      },
    });
    return new History({
      id: updated.id,
      clientId: updated.clientId,
      name: updated.name,
      version: updated.version,
      startDate: updated.startDate,
      realRate: updated.realRate,
      inflation: updated.inflation,
      lifeStatus: updated.lifeStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.simulation.delete({
      where: { id },
    });
  }
}