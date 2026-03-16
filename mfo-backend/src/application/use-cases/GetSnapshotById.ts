// src/application/use-cases/GetSnapshotById.ts

import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { Snapshot } from '@/domain/entities/Snapshot'

interface GetSnapshotByIdRequest {
  id: string
}

export class GetSnapshotById {
  constructor(private snapshotsRepository: ISnapshotsRepository) {}

  async execute(data: GetSnapshotByIdRequest): Promise<Snapshot | null> {
    return this.snapshotsRepository.findById(data.id)
  }
}