import { ListClientMovements } from '@/application/use-cases/ListClientMovements'
import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { Movement } from '@/domain/entities/Movement'

function makeMovementsRepo(): jest.Mocked<IMovementsRepository> {
  return {
    findById: jest.fn(),
    findByClientId: jest.fn(),
    findByClientIdAndType: jest.fn(),
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

describe('Caso de uso ListClientMovements', () => {
  it('lança erro quando o cliente não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    const clientRepo = makeClientRepo()
    clientRepo.findById.mockResolvedValue(null)

    const sut = new ListClientMovements(movementsRepo, clientRepo)

    await expect(
      sut.execute('non-existent-client'),
    ).rejects.toThrow('Client not found.')
  })

  it('retorna lista de movimentos do cliente', async () => {
    const movementsRepo = makeMovementsRepo()
    const clientRepo = makeClientRepo()

    clientRepo.findById.mockResolvedValue({ id: 'client-1' } as any)

    const movement = Movement.create({
      id: 'mov-1',
      clientId: 'client-1',
      name: 'Salário',
      type: 'INCOME',
      value: 1000,
      startDate: new Date('2024-01-01T00:00:00.000Z'),
      endDate: null,
      frequency: 'MONTHLY',
      isRecurrent: true,
      isIndexed: false,
      indexationRate: null,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: null,
    })

    movementsRepo.findByClientId.mockResolvedValue([movement])

    const sut = new ListClientMovements(movementsRepo, clientRepo)

    const result = await sut.execute('client-1')

    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('mov-1')
    expect(movementsRepo.findByClientId).toHaveBeenCalledWith('client-1')
  })
})

