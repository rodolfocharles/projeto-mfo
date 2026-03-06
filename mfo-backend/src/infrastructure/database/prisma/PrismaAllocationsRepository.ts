// src/infrastructure/database/prisma/PrismaAllocationsRepository.ts

import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { Allocation } from '@/domain/entities/Allocation';
import { prisma } from './prismaClient';
import { AllocationType } from '@/domain/value-objects/AllocationType';

// Helper para evitar repetição do mapeamento Prisma → Entidade
function toDomainAllocation(record: {
  id: string;
  clientId: string;
  snapshotId: string | null;
  name: string;
  type: string;
  value: number;
  startDate: Date;
  contribution: number;
  rate: number;
  isTaxable: boolean;
  isFinanced: boolean;
  downPayment: number | null;
  installments: number | null;
  interestRate: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}): Allocation {
  return Allocation.create({
    id: record.id,
    clientId: record.clientId,
    snapshotId: record.snapshotId ?? undefined,
    name: record.name,
    type: record.type as AllocationType,
    value: record.value,
    startDate: record.startDate,
    contribution: record.contribution,
    rate: record.rate,
    isTaxable: record.isTaxable,
    isFinanced: record.isFinanced,
    downPayment: record.downPayment ?? undefined,
    installments: record.installments ?? undefined,
    interestRate: record.interestRate ?? undefined,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt ?? undefined,
  });
}

export class PrismaAllocationsRepository implements IAllocationsRepository {
  async findById(id: string): Promise<Allocation | null> {
    const record = await prisma.allocation.findUnique({ where: { id } });
    if (!record) return null;
    return toDomainAllocation(record);
  }

  async findByClientId(clientId: string): Promise<Allocation[]> {
    const records = await prisma.allocation.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
    });
    return records.map(toDomainAllocation);
  }

  async create(allocation: Allocation): Promise<Allocation> {
    const record = await prisma.allocation.create({
      data: {
        id: allocation.id,
        clientId: allocation.clientId,
        snapshotId: allocation.snapshotId,
        name: allocation.name,
        type: allocation.type,
        value: allocation.value,
        startDate: allocation.startDate,
        contribution: allocation.contribution,
        rate: allocation.rate,
        isTaxable: allocation.isTaxable,
        isFinanced: allocation.isFinanced,
        downPayment: allocation.downPayment,
        installments: allocation.installments,
        interestRate: allocation.interestRate,
        createdAt: allocation.createdAt,
        updatedAt: allocation.updatedAt,
      },
    });
    return toDomainAllocation(record);
  }

  async update(allocation: Allocation): Promise<Allocation> {
    const record = await prisma.allocation.update({
      where: { id: allocation.id },
      data: {
        name: allocation.name,
        type: allocation.type,
        value: allocation.value,
        startDate: allocation.startDate,
        contribution: allocation.contribution,
        rate: allocation.rate,
        isTaxable: allocation.isTaxable,
        isFinanced: allocation.isFinanced,
        downPayment: allocation.downPayment,
        installments: allocation.installments,
        interestRate: allocation.interestRate,
        updatedAt: allocation.updatedAt,
      },
    });
    return toDomainAllocation(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.allocation.delete({ where: { id } });
  }
}