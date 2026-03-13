// src/application/use-cases/CreateSnapshot.ts

import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { Snapshot } from '@/domain/entities/Snapshot'

interface CreateSnapshotRequest {
  clientId: string
  date: string
  name?: string
  financialTotal?: number
  immobilizedTotal?: number
  totalValue?: number
}

export class CreateSnapshot {
  constructor(
    private snapshotsRepository: ISnapshotsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(data: CreateSnapshotRequest): Promise<Snapshot> {
    const client = await this.clientRepository.findById(data.clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    const snapshot = Snapshot.create({
      clientId: data.clientId,
      date: new Date(data.date),
      name: data.name,
      financialTotal: data.financialTotal ?? 0,
      immobilizedTotal: data.immobilizedTotal ?? 0,
      totalValue: data.totalValue ?? 0,
    })

    return this.snapshotsRepository.create(snapshot)
  }
}