// src/application/use-cases/UpdateSnapshot.ts

import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { Snapshot } from '@/domain/entities/Snapshot'

interface UpdateSnapshotRequest {
  id: string
  financialTotal?: number
  immobilizedTotal?: number
  totalValue?: number
}

export class UpdateSnapshot {
  constructor(private snapshotsRepository: ISnapshotsRepository) {}

  async execute(data: UpdateSnapshotRequest): Promise<Snapshot> {
    const snapshot = await this.snapshotsRepository.findById(data.id)
    if (!snapshot) {
      throw new Error('Snapshot not found')
    }

    const updateData: any = {}
    if (data.financialTotal !== undefined) {
      updateData.financialTotal = data.financialTotal
    }
    if (data.immobilizedTotal !== undefined) {
      updateData.immobilizedTotal = data.immobilizedTotal
    }
    if (data.totalValue !== undefined) {
      updateData.totalValue = data.totalValue
    }

    return this.snapshotsRepository.update(data.id, updateData)
  }
}