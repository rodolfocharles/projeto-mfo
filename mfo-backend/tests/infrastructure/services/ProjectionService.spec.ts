import { ProjectionService } from '@/infrastructure/services/ProjectionService'
import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'

function makeMovementsRepo(): jest.Mocked<IMovementsRepository> {
  return {
    findByClientId: jest.fn(),
  } as any
}

function makeInsurancesRepo(): jest.Mocked<IInsurancesRepository> {
  return {
    findByClientId: jest.fn(),
  } as any
}

function makeSnapshotsRepo(): jest.Mocked<ISnapshotsRepository> {
  return {
    findLatestByClientId: jest.fn(),
  } as any
}

function makeClientRepo(): jest.Mocked<IClientRepository> {
  return {
    findById: jest.fn(),
  } as any
}

function makeSimulationsRepo(): jest.Mocked<ISimulationsRepository> {
  return {
    findById: jest.fn(),
  } as any
}

describe('ProjectionService', () => {
  const baseSimulation = {
    id: 'sim-1',
    clientId: 'client-1',
    startDate: new Date('2024-01-01T00:00:00.000Z'),
  } as any

  const baseSnapshot = {
    clientId: 'client-1',
    financialValue: 1000,
    immobilizedValue: 500,
    monthlyInterestRate: 1, // 1%
    monthlyInflationRate: 0.5, // 0.5%
  } as any

  const baseClient = {
    id: 'client-1',
    birthDate: new Date('1990-01-01T00:00:00.000Z'),
  } as any

  it('lança erro quando a simulação não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    const insurancesRepo = makeInsurancesRepo()
    const snapshotsRepo = makeSnapshotsRepo()
    const clientRepo = makeClientRepo()
    const simulationsRepo = makeSimulationsRepo()

    simulationsRepo.findById.mockResolvedValue(null)

    const sut = new ProjectionService(
      movementsRepo,
      insurancesRepo,
      snapshotsRepo,
      clientRepo,
      simulationsRepo,
    )

    await expect(
      sut.calculate('non-existent', 1),
    ).rejects.toThrow('Simulation not found')
  })

  it('lança erro quando não há snapshot do cliente', async () => {
    const movementsRepo = makeMovementsRepo()
    const insurancesRepo = makeInsurancesRepo()
    const snapshotsRepo = makeSnapshotsRepo()
    const clientRepo = makeClientRepo()
    const simulationsRepo = makeSimulationsRepo()

    simulationsRepo.findById.mockResolvedValue(baseSimulation)
    snapshotsRepo.findLatestByClientId.mockResolvedValue(null)

    const sut = new ProjectionService(
      movementsRepo,
      insurancesRepo,
      snapshotsRepo,
      clientRepo,
      simulationsRepo,
    )

    await expect(
      sut.calculate(baseSimulation.id, 1),
    ).rejects.toThrow('No client snapshot found for projection. Please create a snapshot for the client.')
  })

  it('lança erro quando o cliente não existe', async () => {
    const movementsRepo = makeMovementsRepo()
    const insurancesRepo = makeInsurancesRepo()
    const snapshotsRepo = makeSnapshotsRepo()
    const clientRepo = makeClientRepo()
    const simulationsRepo = makeSimulationsRepo()

    simulationsRepo.findById.mockResolvedValue(baseSimulation)
    snapshotsRepo.findLatestByClientId.mockResolvedValue(baseSnapshot)
    clientRepo.findById.mockResolvedValue(null)

    const sut = new ProjectionService(
      movementsRepo,
      insurancesRepo,
      snapshotsRepo,
      clientRepo,
      simulationsRepo,
    )

    await expect(
      sut.calculate(baseSimulation.id, 1),
    ).rejects.toThrow('Client not found')
  })

  it('calcula projeção simples para um mês', async () => {
    const movementsRepo = makeMovementsRepo()
    const insurancesRepo = makeInsurancesRepo()
    const snapshotsRepo = makeSnapshotsRepo()
    const clientRepo = makeClientRepo()
    const simulationsRepo = makeSimulationsRepo()

    simulationsRepo.findById.mockResolvedValue(baseSimulation)
    snapshotsRepo.findLatestByClientId.mockResolvedValue(baseSnapshot)
    clientRepo.findById.mockResolvedValue(baseClient)

    const movements = [
      {
        id: 'mov-income',
        clientId: 'client-1',
        type: 'INCOME',
        value: 100,
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
        frequency: 'MONTHLY',
      },
      {
        id: 'mov-expense',
        clientId: 'client-1',
        type: 'EXPENSE',
        value: 50,
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
        frequency: 'MONTHLY',
      },
    ] as any

    const insurances = [
      {
        id: 'ins-1',
        clientId: 'client-1',
        type: 'LIFE',
        name: 'Seguro de Vida Básico', // <--- ADICIONE ISSO!
        premium: 20,
        coverage: 1000,
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
      },
    ] as any

    movementsRepo.findByClientId.mockResolvedValue(movements)
    insurancesRepo.findByClientId.mockResolvedValue(insurances)

    const sut = new ProjectionService(
      movementsRepo,
      insurancesRepo,
      snapshotsRepo,
      clientRepo,
      simulationsRepo,
    )

    const result = await sut.calculate(baseSimulation.id, 1)

    expect(result).toHaveLength(1)
    const first = result[0]!

    expect(first.simulationId).toBe(baseSimulation.id)
    expect(first.income).toBeGreaterThan(0)
    expect(first.expense).toBeGreaterThan(0)
    expect(first.total).toBeGreaterThan(0)
    expect(first.accumulatedIncome).toBe(first.income)
    expect(first.accumulatedExpenses).toBe(first.expense)
  })

  it('aplica cenário de falecimento e evento no mês configurado', async () => {
    const movementsRepo = makeMovementsRepo()
    const insurancesRepo = makeInsurancesRepo()
    const snapshotsRepo = makeSnapshotsRepo()
    const clientRepo = makeClientRepo()
    const simulationsRepo = makeSimulationsRepo()

    simulationsRepo.findById.mockResolvedValue(baseSimulation)
    snapshotsRepo.findLatestByClientId.mockResolvedValue(baseSnapshot)
    clientRepo.findById.mockResolvedValue(baseClient)

    const movements: any[] = []

    const insurances = [
      {
        id: 'ins-life',
        clientId: 'client-1',
        type: 'LIFE',
        name: 'Seguro de Vida Premium', // <--- ADICIONE ISSO!
        premium: 10,
        coverage: 5000,
        startDate: new Date('2024-01-01T00:00:00.000Z'),
        endDate: null,
      },
    ] as any

    movementsRepo.findByClientId.mockResolvedValue(movements)
    insurancesRepo.findByClientId.mockResolvedValue(insurances)

    const sut = new ProjectionService(
      movementsRepo,
      insurancesRepo,
      snapshotsRepo,
      clientRepo,
      simulationsRepo,
    )

    const result = await sut.calculate(baseSimulation.id, 1, 'DECEASED', 1)

    expect(result).toHaveLength(1)
    const first = result[0]!

    expect(first.insuranceValueReceived).toBe(5000)
    expect(first.totalInsuranceValue).toBe(5000)
  })
})

