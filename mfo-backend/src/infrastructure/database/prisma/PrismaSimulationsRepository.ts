// src/infrastructure/database/prisma/PrismaSimulationsRepository.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { Simulation } from '@/domain/entities/Simulation'
import { prisma } from './prismaClient'
import { LifeStatus } from '@/domain/value-objects/LifeStatus'

function toDomainSimulation(record: {
  id: string
  clientId: string
  name: string
  startDate: Date
  realRate: number
  inflation: number
  lifeStatus: string
  version: number
  createdAt: Date
  updatedAt: Date | null
  scenario?: string
  endDate?: Date
  retirementAge?: number
  isActive?: boolean
}): Simulation {
  return Simulation.create({
    id: record.id,
    clientId: record.clientId,
    name: record.name,
    startDate: record.startDate,
    realRate: record.realRate,
    inflation: record.inflation,
    lifeStatus: record.lifeStatus as LifeStatus,
    version: record.version,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? undefined,
    scenario: record.scenario,
    endDate: record.endDate,
    retirementAge: record.retirementAge,
    isActive: record.isActive,
  })
}

export class PrismaSimulationsRepository implements ISimulationsRepository {
  async findById(id: string): Promise<Simulation | null> {
    const record = await prisma.simulation.findUnique({ where: { id } })
    if (!record) return null
    return toDomainSimulation(record)
  }

  async findByClientId(clientId: string): Promise<Simulation[]> {
    const records = await prisma.simulation.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toDomainSimulation)
  }

  async findByClientIdAndName(clientId: string, name: string): Promise<Simulation[]> {
    const records = await prisma.simulation.findMany({
      where: { clientId, name },
      orderBy: { version: 'desc' },
    })
    return records.map(toDomainSimulation)
  }

  async create(simulation: Simulation): Promise<Simulation> {
    const record = await prisma.simulation.create({
      data: {
        id: simulation.id,
        clientId: simulation.clientId,
        name: simulation.name,
        startDate: simulation.startDate,
        realRate: simulation.realRate,
        inflation: simulation.inflation,
        lifeStatus: simulation.lifeStatus,
        version: simulation.version,
        createdAt: simulation.createdAt,
        updatedAt: simulation.updatedAt,
        scenario: simulation.scenario,
        endDate: simulation.endDate,
        retirementAge: simulation.retirementAge,
        isActive: simulation.isActive,
      },
    })
    return toDomainSimulation(record)
  }

  async update(simulation: Simulation): Promise<Simulation> {
    const record = await prisma.simulation.update({
      where: { id: simulation.id },
      data: {
        name: simulation.name,
        startDate: simulation.startDate,
        realRate: simulation.realRate,
        inflation: simulation.inflation,
        lifeStatus: simulation.lifeStatus,
        updatedAt: simulation.updatedAt,
        scenario: simulation.scenario,
        endDate: simulation.endDate,
        retirementAge: simulation.retirementAge,
        isActive: simulation.isActive,
      },
    })
    return toDomainSimulation(record)
  }

  async delete(id: string): Promise<void> {
    await prisma.simulation.delete({ where: { id } })
  }
}