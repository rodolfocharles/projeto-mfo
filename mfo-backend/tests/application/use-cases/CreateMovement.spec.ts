import { CreateMovement } from '@/application/use-cases/CreateMovement'
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

describe('Caso de uso CreateMovement', () => {
  it('lança erro quando o cliente não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    const clientRepo = makeClientRepo()
    clientRepo.findById.mockResolvedValue(null)

    const sut = new CreateMovement(movementsRepo, clientRepo)

    await expect(
      sut.execute({
        clientId: 'non-existent',
        name: 'Salário',
        type: 'INCOME',
        value: 1000,
        startDate: new Date().toISOString(),
        frequency: 'MONTHLY',
        isIndexed: false,
      } as any),
    ).rejects.toThrow('Client not found.')
  })

  it('cria uma movimentação com dados válidos', async () => {
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

    movementsRepo.create.mockResolvedValue(movement)

    const sut = new CreateMovement(movementsRepo, clientRepo)

    const result = await sut.execute({
      clientId: 'client-1',
      name: 'Salário',
      type: 'INCOME',
      value: 1000,
      startDate: '2024-01-01T00:00:00.000Z',
      frequency: 'MONTHLY',
      isIndexed: false,
    } as any)

    expect(result.id).toBe(movement.id)
    expect(movementsRepo.create).toHaveBeenCalledWith(expect.any(Movement))
  })
})

