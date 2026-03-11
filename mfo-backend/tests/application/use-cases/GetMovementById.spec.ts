import { GetMovementById } from '@/application/use-cases/GetMovementById'
import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
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

describe('Caso de uso GetMovementById', () => {
  it('lança erro quando a movimentação não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    movementsRepo.findById.mockResolvedValue(null)

    const sut = new GetMovementById(movementsRepo)

    await expect(
      sut.execute('non-existent'),
    ).rejects.toThrow('Movement not found.')
  })

  it('retorna a movimentação quando encontrada', async () => {
    const movementsRepo = makeMovementsRepo()

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

    movementsRepo.findById.mockResolvedValue(movement)

    const sut = new GetMovementById(movementsRepo)

    const result = await sut.execute('mov-1')

    expect(result.id).toBe('mov-1')
    expect(movementsRepo.findById).toHaveBeenCalledWith('mov-1')
  })
})

