// src/application/use-cases/UpdateSimulation.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IUpdateSimulationUseCase } from './interfaces/ISimulationUseCases'
import { UpdateSimulationInput, SimulationResponse } from '@/application/dtos/SimulationDTO'
import { LifeStatus } from '@/domain/value-objects/LifeStatus'
import { simulationToResponse } from './helpers/simulationToResponse'

export class UpdateSimulation implements IUpdateSimulationUseCase {
  constructor(private simulationsRepository: ISimulationsRepository) {}

  async execute(simulationId: string, input: UpdateSimulationInput): Promise<SimulationResponse> {
    const simulation = await this.simulationsRepository.findById(simulationId)
    if (!simulation) throw new Error('Simulation not found.')

    if (
      input.name !== undefined ||
      input.startDate !== undefined ||
      input.realRate !== undefined ||
      input.inflation !== undefined ||
      input.lifeStatus !== undefined ||
      input.scenario !== undefined ||
      input.endDate !== undefined ||
      input.retirementAge !== undefined ||
      input.isActive !== undefined
    ) {
      simulation.updateDetails(
        input.name ?? simulation.name,
        input.startDate ? new Date(input.startDate) : simulation.startDate,
        input.realRate ?? simulation.realRate,
        input.inflation ?? simulation.inflation,
        (input.lifeStatus as LifeStatus) ?? simulation.lifeStatus,
        input.scenario,
        input.endDate ? new Date(input.endDate) : undefined,
        input.retirementAge,
        input.isActive,
      )
    }

    const updated = await this.simulationsRepository.update(simulation)
    return simulationToResponse(updated)
  }
}