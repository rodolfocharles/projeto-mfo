import { CreateSimulation } from '@/application/use-cases/CreateSimulation'
import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { Simulation } from '@/domain/entities/Simulation'

// simple stub implementations returning mocked interfaces
function makeSimRepo(): jest.Mocked<ISimulationsRepository> {
  return {
    findById: jest.fn(),
    create: jest.fn(),
    findManyByClient: jest.fn() as any,
    // add other methods from interface if tests need them
  } as any
}

function makeClientRepo(): jest.Mocked<IClientRepository> {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn() as any,
    create: jest.fn() as any,
    // etc.
  } as any
}

describe('Caso de uso CreateSimulation', () => {
  it('lança erro quando o cliente não existe', async () => {
    const simRepo = makeSimRepo()
    const clientRepo = makeClientRepo()
    clientRepo.findById.mockResolvedValue(null)

    const sut = new CreateSimulation(simRepo, clientRepo)

    await expect(
      sut.execute({
        clientId: 'nonexistent',
        name: 'foo',
        startDate: new Date().toISOString(),
        realRate: 0.1,
        inflation: 0.02,
        lifeStatus: 'alive' as any,
        scenario: 'base',
      } as any),
    ).rejects.toThrow('Client not found.')
  })

  it('cria uma simulação com dados válidos', async () => {
    const simRepo = makeSimRepo()
    const clientRepo = makeClientRepo()
    const fakeClient = { id: 'client1' } as any
    clientRepo.findById.mockResolvedValue(fakeClient)

    const createdSim = Simulation.create({
      clientId: 'client1',
      name: 'test',
      startDate: new Date(),
      realRate: 0.1,
      inflation: 0.02,
      lifeStatus: 'alive' as any,
      version: 1,
      scenario: 'base',
      isActive: true,
    })
    simRepo.create.mockResolvedValue(createdSim as any)

    const sut = new CreateSimulation(simRepo, clientRepo)

    const result = await sut.execute({
      clientId: 'client1',
      name: 'test',
      startDate: new Date().toISOString(),
      realRate: 0.1,
      inflation: 0.02,
      lifeStatus: 'alive' as any,
      scenario: 'base',
      isActive: true,
    } as any)

    expect(result.id).toBe(createdSim.id)
    expect(simRepo.create).toHaveBeenCalledWith(expect.any(Simulation))
  })
})
