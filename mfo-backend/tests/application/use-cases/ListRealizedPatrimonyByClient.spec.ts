import { ListRealizedPatrimonyByClient } from '@/application/use-cases/ListRealizedPatrimonyByClient'
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository'
import { IAllocationSnapshotItemsRepository } from '@/domain/repositories/IAllocationSnapshotItemsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'

function makeAllocationSnapshotsRepo(): jest.Mocked<IAllocationSnapshotsRepository> {
  return {
    findById: jest.fn(),
    findByClientId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any
}

function makeAllocationSnapshotItemsRepo(): jest.Mocked<IAllocationSnapshotItemsRepository> {
  return {
    findById: jest.fn(),
    findBySnapshotId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any
}

function makeClientRepo(): jest.Mocked<IClientRepository> {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn() as any,
    findAll: jest.fn() as any,
    create: jest.fn() as any,
    update: jest.fn() as any,
    delete: jest.fn() as any,
  } as any
}

describe('Caso de uso ListRealizedPatrimonyByClient', () => {
  it('lança erro quando o cliente não existe', async () => {
    const allocationSnapshotsRepo = makeAllocationSnapshotsRepo()
    const allocationSnapshotItemsRepo = makeAllocationSnapshotItemsRepo()
    const clientRepo = makeClientRepo()

    clientRepo.findById.mockResolvedValue(null)

    const sut = new ListRealizedPatrimonyByClient(
      allocationSnapshotsRepo,
      allocationSnapshotItemsRepo,
      clientRepo,
    )

    await expect(
      sut.execute({ id: 'non-existent-client' } as any),
    ).rejects.toThrow('Client not found.')
  })

  it('retorna histórico de patrimônio ordenado cronologicamente com itens do snapshot', async () => {
    const allocationSnapshotsRepo = makeAllocationSnapshotsRepo()
    const allocationSnapshotItemsRepo = makeAllocationSnapshotItemsRepo()
    const clientRepo = makeClientRepo()

    clientRepo.findById.mockResolvedValue({ id: 'client-1' } as any)

    const snapshot1 = {
      id: 'snap-1',
      clientId: 'client-1',
      date: new Date('2024-01-01T00:00:00.000Z'),
      totalValue: 1000,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: null,
    } as any

    const snapshot2 = {
      id: 'snap-2',
      clientId: 'client-1',
      date: new Date('2024-02-01T00:00:00.000Z'),
      totalValue: 2000,
      createdAt: new Date('2024-02-01T00:00:00.000Z'),
      updatedAt: null,
    } as any

    // repo retorna em ordem inversa para garantir que o caso de uso reordene
    allocationSnapshotsRepo.findByClientId.mockResolvedValue([snapshot2, snapshot1])

    const itemsSnap1 = [
      {
        id: 'item-1',
        snapshotId: 'snap-1',
        allocationId: 'alloc-1',
        valueAtSnapshot: 600,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: null,
      },
    ] as any

    const itemsSnap2 = [
      {
        id: 'item-2',
        snapshotId: 'snap-2',
        allocationId: 'alloc-2',
        valueAtSnapshot: 1200,
        createdAt: new Date('2024-02-01T00:00:00.000Z'),
        updatedAt: null,
      },
    ] as any

    allocationSnapshotItemsRepo.findBySnapshotId
      .mockResolvedValueOnce(itemsSnap1)
      .mockResolvedValueOnce(itemsSnap2)

    const sut = new ListRealizedPatrimonyByClient(
      allocationSnapshotsRepo,
      allocationSnapshotItemsRepo,
      clientRepo,
    )

    const result = await sut.execute({ id: 'client-1' } as any)

    expect(result).toHaveLength(2)

    const first = result[0]!
    const second = result[1]!

    // deve estar ordenado por data ascendente
    expect(first.id).toBe('snap-1')
    expect(second.id).toBe('snap-2')

    // verifica transformação de datas e itens
    const firstItem = first.allocationSnapshots[0]!
    const secondItem = second.allocationSnapshots[0]!

    expect(firstItem.id).toBe('item-1')
    expect(firstItem.snapshotId).toBe('snap-1')
    expect(firstItem.createdAt).toBe('2024-01-01T00:00:00.000Z')
    expect(secondItem.id).toBe('item-2')
    expect(secondItem.snapshotId).toBe('snap-2')
    expect(secondItem.createdAt).toBe('2024-02-01T00:00:00.000Z')
  })
})
