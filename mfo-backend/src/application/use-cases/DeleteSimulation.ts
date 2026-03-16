// src/application/use-cases/DeleteSimulation.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IDeleteSimulationUseCase } from './interfaces/ISimulationUseCases'
import { DeleteSimulationInput } from '@/application/dtos/SimulationDTO'

export class DeleteSimulation implements IDeleteSimulationUseCase {
  constructor(private simulationsRepository: ISimulationsRepository) {}

  async execute(input: DeleteSimulationInput): Promise<void> {
    const simulation = await this.simulationsRepository.findById(input.simulationId)
    if (!simulation) throw new Error('Simulation not found.')
    await this.simulationsRepository.delete(input.simulationId)
  }
}