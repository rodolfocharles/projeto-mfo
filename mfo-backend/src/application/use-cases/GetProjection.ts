// src/application/use-cases/GetProjection.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IGetProjectionUseCase } from './interfaces/ISimulationUseCases'
import { GetProjectionInput, ProjectionResponse } from '@/application/dtos/SimulationDTO'
import { IProjectionService } from '@/infrastructure/services/IProjectionService'

export class GetProjection implements IGetProjectionUseCase {
  constructor(
    private simulationsRepository: ISimulationsRepository,
    private projectionService: IProjectionService,
  ) {}

  async execute(input: GetProjectionInput): Promise<ProjectionResponse> {
    const simulation = await this.simulationsRepository.findById(input.simulationId)
    if (!simulation) throw new Error('Simulation not found.')

    const projection = await this.projectionService.calculate(
      input.simulationId,
      input.months,
      input.scenario,
      input.eventMonth,
    )

    return projection
  }
}