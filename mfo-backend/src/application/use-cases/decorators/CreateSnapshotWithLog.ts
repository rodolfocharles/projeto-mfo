// src/application/use-cases/decorators/CreateSnapshotWithLog.ts
import { CreateSnapshot } from '../CreateSnapshot'
import { ILogger } from '@/infrastructure/services/ILogger'
import { Snapshot } from '@/domain/entities/Snapshot'

interface CreateSnapshotRequest {
  clientId: string
  date: string
  name?: string
  financialTotal?: number
  immobilizedTotal?: number
  totalValue?: number
}

export class CreateSnapshotWithLog {
  constructor(
    private createSnapshot: CreateSnapshot,
    private logger: ILogger,
  ) {}

  async execute(data: CreateSnapshotRequest): Promise<Snapshot> {
    this.logger.log('[CreateSnapshot] Creating snapshot', data)
    try {
      const result = await this.createSnapshot.execute(data)
      this.logger.log('[CreateSnapshot] Snapshot created successfully', result)
      return result
    } catch (error) {
      this.logger.error('[CreateSnapshot] Failed to create snapshot', error)
      throw error
    }
  }
}