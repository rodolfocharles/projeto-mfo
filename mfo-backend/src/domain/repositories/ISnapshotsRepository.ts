import { AllocationSnapshot } from '../entities/AllocationSnapshot'

export interface ISnapshotsRepository {
  findLatestByClientId(clientId: string): Promise<AllocationSnapshot | null>
}

