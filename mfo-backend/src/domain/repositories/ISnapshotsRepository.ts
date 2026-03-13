// src/domain/repositories/ISnapshotsRepository.ts
import { Snapshot } from '@/domain/entities/Snapshot';

export interface ISnapshotsRepository {
  findById(id: string): Promise<Snapshot | null>;
  findByClientId(clientId: string): Promise<Snapshot[]>;
  findLatestByClientId(clientId: string): Promise<Snapshot | null>;
  create(snapshot: Snapshot): Promise<Snapshot>;
  update(id: string, snapshot: Partial<Snapshot>): Promise<Snapshot>;
  delete(id: string): Promise<void>;
}