import { CompareSimulations } from '@/application/use-cases/CompareSimulations'
import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IProjectionService } from '@/infrastructure/services/IProjectionService'

function makeSimRepo(): jest.Mocked<ISimulationsRepository> {
  return {
    findById: jest.fn(),
    findManyByClient: jest.fn() as any,
    // other repository methods if needed
  } as any
}

function makeProjection(): jest.Mocked<IProjectionService> {
  return {
    calculate: jest.fn(),
  } as any
}

describe('Caso de uso CompareSimulations', () => {
  it('lança erro se a primeira simulação não existir', async () => {
    const simRepo = makeSimRepo()
    const projection = makeProjection()
    simRepo.findById.mockResolvedValueOnce(null)
    simRepo.findById.mockResolvedValueOnce({ id: '2', name: 'two', version: 1, realRate: 0, inflation: 0 } as any)

    const sut = new CompareSimulations(simRepo, projection)
    await expect(
      sut.execute({ id1: '1', id2: '2', months: 1, scenario: 'x' } as any),
    ).rejects.toThrow('First simulation not found.')
  })

  it('calcula a comparação quando ambas as simulações existem', async () => {
    const simRepo = makeSimRepo()
    const projection = makeProjection()
    const sim1 = { id: '1', name: 'one', version: 1, realRate: 0, inflation: 0 } as any
    const sim2 = { id: '2', name: 'two', version: 1, realRate: 0, inflation: 0 } as any
    simRepo.findById.mockResolvedValueOnce(sim1)
    simRepo.findById.mockResolvedValueOnce(sim2)

    projection.calculate.mockResolvedValue(
      [{ period: 'm0' as any, total: 100, financial: 50, immobilized: 50 } as any],
    )

    const sut = new CompareSimulations(simRepo, projection)
    const out = await sut.execute({ id1: '1', id2: '2', months: 1, scenario: 'x' } as any)

    expect(out.simulation1.id).toBe('1')
    expect(out.simulation2.id).toBe('2')
    // cast to any for loosened typing
    expect((out as any).comparison[0].simulation1.total).toBe(100)
  })
})