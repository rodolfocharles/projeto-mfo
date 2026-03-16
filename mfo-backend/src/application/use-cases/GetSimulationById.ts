// src/application/use-cases/GetSimulationById.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IGetSimulationByIdUseCase } from './interfaces/ISimulationUseCases'
import { GetSimulationByIdInput, SimulationResponse } from '@/application/dtos/SimulationDTO'
import { simulationToResponse } from './helpers/simulationToResponse'

export class GetSimulationById implements IGetSimulationByIdUseCase {
  constructor(private simulationsRepository: ISimulationsRepository) {}

  async execute(input: GetSimulationByIdInput): Promise<SimulationResponse> {
    const simulation = await this.simulationsRepository.findById(input.simulationId)
    if (!simulation) throw new Error('Simulation not found.')
    return simulationToResponse(simulation)
  }
}