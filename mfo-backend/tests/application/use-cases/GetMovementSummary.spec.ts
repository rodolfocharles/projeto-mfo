import { GetMovementSummary } from '@/application/use-cases/GetMovementSummary'
import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'

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

describe('Caso de uso GetMovementSummary', () => {
  it('lança erro quando o cliente não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    const clientRepo = makeClientRepo()

    clientRepo.findById.mockResolvedValue(null)

    const sut = new GetMovementSummary(movementsRepo, clientRepo)

    await expect(
      sut.execute({ clientId: 'non-existent' } as any),
    ).rejects.toThrow('Client not found.')
  })

  it('retorna resumo das movimentações do cliente', async () => {
    const movementsRepo = makeMovementsRepo()
    const clientRepo = makeClientRepo()

    clientRepo.findById.mockResolvedValue({ id: 'client-1' } as any)

    const movements = [
      { type: 'INCOME', value: 100, isRecurrent: true } as any,
      { type: 'EXPENSE', value: 50, isRecurrent: false } as any,
      { type: 'INVESTMENT', value: 200, isRecurrent: true } as any,
      { type: 'WITHDRAWAL', value: 30, isRecurrent: false } as any,
    ]

    movementsRepo.findByClientId.mockResolvedValue(movements)

    const sut = new GetMovementSummary(movementsRepo, clientRepo)

    const result = await sut.execute({ clientId: 'client-1' } as any)

    expect(result.totalMovements).toBe(4)
    expect(result.income).toBe(100)
    expect(result.expense).toBe(50)
    expect(result.investment).toBe(200)
    expect(result.withdrawal).toBe(30)
    expect(result.recurrent).toBe(2)
    expect(result.oneTime).toBe(2)
  })
})

