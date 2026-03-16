// src/application/use-cases/ListClientSnapshots.ts

import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { Snapshot } from '@/domain/entities/Snapshot'

interface ListClientSnapshotsRequest {
  clientId: string
}

export class ListClientSnapshots {
  constructor(
    private snapshotsRepository: ISnapshotsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(data: ListClientSnapshotsRequest): Promise<Snapshot[]> {
    const client = await this.clientRepository.findById(data.clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    return this.snapshotsRepository.findByClientId(data.clientId)
  }
}