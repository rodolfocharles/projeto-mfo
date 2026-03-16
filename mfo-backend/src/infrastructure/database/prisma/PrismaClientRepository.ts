// src/infrastructure/database/prisma/PrismaClientRepository.ts

import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { Client } from '@/domain/entities/Client';
import { prisma } from './prismaClient';
import { LifeStatus } from '@/domain/value-objects/LifeStatus';

// Helper para evitar repetição do mapeamento Prisma → Entidade
function toDomainClient(prismaClient: {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: Date | null;
  lifeStatus: string;
  createdAt: Date;
  updatedAt: Date | null;
}): Client {
  return Client.create({
    id: prismaClient.id,
    name: prismaClient.name,
    email: prismaClient.email,
    password: prismaClient.password,
    birthDate: prismaClient.birthDate ?? undefined,
    lifeStatus: prismaClient.lifeStatus as LifeStatus,
    createdAt: prismaClient.createdAt,
    updatedAt: prismaClient.updatedAt ?? undefined,
  });
}

export class PrismaClientRepository implements IClientRepository {
  async findById(id: string): Promise<Client | null> {
    const record = await prisma.client.findUnique({ where: { id } });
    if (!record) return null;
    return toDomainClient(record);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const record = await prisma.client.findUnique({ where: { email } });
    if (!record) return null;
    return toDomainClient(record);
  }

  async findAll(): Promise<Client[]> {              // ← adicionado
    const records = await prisma.client.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map(toDomainClient);
  }

  async create(client: Client): Promise<Client> {
    if (!client.password) {
      throw new Error('Password hash is required.');  // ← removido fallback perigoso
    }

    const record = await prisma.client.create({
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        password: client.password,
        birthDate: client.birthDate,
        lifeStatus: client.lifeStatus,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
    });

    return toDomainClient(record);
  }

  async update(client: Client): Promise<Client> {
    const record = await prisma.client.update({
      where: { id: client.id },
      data: {
        name: client.name,
        email: client.email,
        password: client.password,
        birthDate: client.birthDate,
        lifeStatus: client.lifeStatus,
        updatedAt: client.updatedAt,
      },
    });

    return toDomainClient(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.client.delete({ where: { id } });
  }
}