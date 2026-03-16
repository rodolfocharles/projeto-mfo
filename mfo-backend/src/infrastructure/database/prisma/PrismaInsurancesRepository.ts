// src/infrastructure/database/prisma/PrismaInsurancesRepository.ts

import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { Insurance } from '@/domain/entities/Insurance'
import { prisma } from './prismaClient'
import { InsuranceType } from '@/domain/value-objects/InsuranceType'

function toDomainInsurance(record: {
  id: string
  clientId: string
  type: string
  name: string
  coverage: number
  premium: number
  startDate: Date
  endDate: Date | null
  createdAt: Date
  updatedAt: Date | null
}): Insurance {
  return Insurance.create({
    id: record.id,
    clientId: record.clientId,
    type: record.type as InsuranceType,
    name: record.name,
    coverage: record.coverage,
    premium: record.premium,
    startDate: record.startDate,
    endDate: record.endDate ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? undefined,
  })
}

export class PrismaInsurancesRepository implements IInsurancesRepository {
  async findById(id: string): Promise<Insurance | null> {
    const record = await prisma.insurance.findUnique({ where: { id } })
    if (!record) return null
    return toDomainInsurance(record)
  }

  async findByClientId(clientId: string): Promise<Insurance[]> {
    const records = await prisma.insurance.findMany({
      where: { clientId },
      orderBy: { startDate: 'desc' },
    })
    return records.map(toDomainInsurance)
  }

  async create(insurance: Insurance): Promise<Insurance> {
    const record = await prisma.insurance.create({
      data: {
        id: insurance.id,
        clientId: insurance.clientId,
        type: insurance.type,
        name: insurance.name,
        coverage: insurance.coverage,
        premium: insurance.premium,
        startDate: insurance.startDate,
        endDate: insurance.endDate ?? null,
        createdAt: insurance.createdAt,
        updatedAt: insurance.updatedAt,
      },
    })
    return toDomainInsurance(record)
  }

  async update(insurance: Insurance): Promise<Insurance> {
    const record = await prisma.insurance.update({
      where: { id: insurance.id },
      data: {
        type: insurance.type,
        name: insurance.name,
        coverage: insurance.coverage,
        premium: insurance.premium,
        startDate: insurance.startDate,
        endDate: insurance.endDate ?? null,
        updatedAt: insurance.updatedAt,
      },
    })
    return toDomainInsurance(record)
  }

  async delete(id: string): Promise<void> {
    await prisma.insurance.delete({ where: { id } })
  }
}