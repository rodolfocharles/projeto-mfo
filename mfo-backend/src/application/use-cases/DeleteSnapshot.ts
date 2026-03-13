// src/application/use-cases/DeleteSnapshot.ts

import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'

interface DeleteSnapshotRequest {
  id: string
}

export class DeleteSnapshot {
  constructor(private snapshotsRepository: ISnapshotsRepository) {}

  async execute(data: DeleteSnapshotRequest): Promise<void> {
    const snapshot = await this.snapshotsRepository.findById(data.id)
    if (!snapshot) {
      throw new Error('Snapshot not found')
    }

    await this.snapshotsRepository.delete(data.id)
  }
}