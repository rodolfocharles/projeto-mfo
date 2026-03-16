import { UpdateMovement } from '@/application/use-cases/UpdateMovement'
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

describe('Caso de uso UpdateMovement', () => {
  it('lança erro quando a movimentação não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    movementsRepo.findById.mockResolvedValue(null)

    const sut = new UpdateMovement(movementsRepo)

    await expect(
      sut.execute('non-existent', {} as any),
    ).rejects.toThrow('Movement not found.')
  })

  it('atualiza a movimentação quando encontrada', async () => {
    const movementsRepo = makeMovementsRepo()

    const original = Movement.create({
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

    movementsRepo.findById.mockResolvedValue(original)
    movementsRepo.update.mockImplementation(async movement => movement)

    const sut = new UpdateMovement(movementsRepo)

    const result = await sut.execute('mov-1', {
      name: 'Novo Salário',
      value: 2000,
    } as any)

    expect(result.name).toBe('Novo Salário')
    expect(result.value).toBe(2000)
    expect(movementsRepo.update).toHaveBeenCalled()
  })
})

