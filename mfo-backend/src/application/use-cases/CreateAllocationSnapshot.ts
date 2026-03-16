// src/application/use-cases/CreateAllocationSnapshot.ts
import { AllocationSnapshot } from '@/domain/entities/AllocationSnapshot';
import { AllocationSnapshotItem } from '@/domain/entities/AllocationSnapshotItem';
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository';
import { IAllocationSnapshotItemsRepository } from '@/domain/repositories/IAllocationSnapshotItemsRepository';
import { IAllocationsRepository } from '@/domain/repositories/IAllocationsRepository';
import { IClientRepository } from '@/domain/repositories/IClientRepository';
import { CreateAllocationSnapshotInput, FullAllocationSnapshotResponse } from '@/application/dtos/AllocationSnapshotDTO';
import { ICreateAllocationSnapshotUseCase } from './interfaces/IAllocationSnapshotUseCases';
import { allocationSnapshotToResponse } from './helpers/allocationSnapshotToResponse';

export class CreateAllocationSnapshot implements ICreateAllocationSnapshotUseCase {
  constructor(
    private allocationSnapshotsRepository: IAllocationSnapshotsRepository,
    private allocationSnapshotItemsRepository: IAllocationSnapshotItemsRepository,
    private allocationsRepoForSnapshot: IAllocationsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: CreateAllocationSnapshotInput): Promise<FullAllocationSnapshotResponse> {
    // 1. Validar se o cliente existe
    const clientExists = await this.clientRepository.findById(input.clientId);
    if (!clientExists) {
      throw new Error('Client not found.');
    }

    // 2. Buscar as alocações atuais do cliente
    const clientAllocations = await this.allocationsRepoForSnapshot.findByClientId(input.clientId);
    if (clientAllocations.length === 0) {
      throw new Error('Client has no allocations to snapshot.');
    }

    // 3. Calcular o totalValue
    const totalValue = clientAllocations.reduce((sum, alloc) => sum + alloc.value, 0);

    // 4. Criar a entidade AllocationSnapshot
    const snapshot = AllocationSnapshot.create({
      clientId: input.clientId,
      date: new Date(input.date),
      totalValue,
    });

    // 5. Persistir o snapshot
    const createdSnapshot = await this.allocationSnapshotsRepository.create(snapshot);

    // 6. Criar e persistir os itens do snapshot
    const items: AllocationSnapshotItem[] = [];
    for (const alloc of clientAllocations) {
      const item = AllocationSnapshotItem.create({
        snapshotId: createdSnapshot.id,
        allocationId: alloc.id,
        valueAtSnapshot: alloc.value,
      });
      const createdItem = await this.allocationSnapshotItemsRepository.create(item);
      items.push(createdItem);
    }

    // 7. Retornar no formato FullAllocationSnapshotResponse
    return allocationSnapshotToResponse(createdSnapshot, items);
  }
}