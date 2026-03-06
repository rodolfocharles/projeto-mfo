// src/application/use-cases/CreateSimulation.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { ICreateSimulationUseCase } from './interfaces/ISimulationUseCases'
import { CreateSimulationInput, SimulationResponse } from '@/application/dtos/SimulationDTO'
import { LifeStatus } from '@/domain/value-objects/LifeStatus'
import { Simulation } from '@/domain/entities/Simulation'
import { simulationToResponse } from './helpers/simulationToResponse'

export class CreateSimulation implements ICreateSimulationUseCase {
  constructor(
    private simulationsRepository: ISimulationsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: CreateSimulationInput): Promise<SimulationResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const simulation = Simulation.create({
      clientId: input.clientId,
      name: input.name,
      startDate: new Date(input.startDate),
      realRate: input.realRate,
      inflation: input.inflation,
      lifeStatus: input.lifeStatus as LifeStatus,
      version: input.version || 1,
      scenario: input.scenario,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      retirementAge: input.retirementAge,
      isActive: input.isActive,
    })

    const created = await this.simulationsRepository.create(simulation)
    return simulationToResponse(created)
  }
}