// src/infrastructure/services/RealizedService.ts

import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { IRealizedService, RealizedResultItem } from './IRealizedService'

export class RealizedService implements IRealizedService {
  constructor(private snapshotsRepository: ISnapshotsRepository) {}

  async calculate(clientId: string): Promise<RealizedResultItem[]> {
    const snapshots = await this.snapshotsRepository.findByClientId(clientId)

    return snapshots.map(snapshot => {
      const financial = snapshot.allocations
        .filter(a => a.type === 'FINANCIAL')
        .reduce((sum, a) => sum + a.value, 0)

      const immobilized = snapshot.allocations
        .filter(a => a.type === 'IMMOBILIZED')
        .reduce((sum, a) => sum + a.value, 0)

      return {
        date: snapshot.date,
        financial,
        immobilized,
        total: financial + immobilized,
      }
    })
  }
}