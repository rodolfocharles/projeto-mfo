// src/application/use-cases/CreateSimulationVersion.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { ICreateSimulationVersionUseCase } from './interfaces/ISimulationUseCases'
import { CreateSimulationVersionInput, SimulationResponse } from '@/application/dtos/SimulationDTO'
import { LifeStatus } from '@/domain/value-objects/LifeStatus'
import { simulationToResponse } from './helpers/simulationToResponse'

export class CreateSimulationVersion implements ICreateSimulationVersionUseCase {
  constructor(private simulationsRepository: ISimulationsRepository) {}

  async execute(input: CreateSimulationVersionInput): Promise<SimulationResponse> {
    const originalSimulation = await this.simulationsRepository.findById(input.simulationId)
    if (!originalSimulation) throw new Error('Simulation not found.')

    // Buscar última versão com o mesmo nome
    const versions = await this.simulationsRepository.findByClientIdAndName(
      originalSimulation.clientId,
      originalSimulation.name,
    )

    const newVersion = originalSimulation.createVersion()

    // Aplicar atualizações se fornecidas
    if (input.updateData) {
      newVersion.updateDetails(
        input.updateData.name ?? newVersion.name,
        input.updateData.startDate ? new Date(input.updateData.startDate) : newVersion.startDate,
        input.updateData.realRate ?? newVersion.realRate,
        input.updateData.inflation ?? newVersion.inflation,
        (input.updateData.lifeStatus as LifeStatus) ?? newVersion.lifeStatus,
        input.updateData.scenario,
        input.updateData.endDate ? new Date(input.updateData.endDate) : undefined,
        input.updateData.retirementAge,
        input.updateData.isActive,
      )
    }

    const created = await this.simulationsRepository.create(newVersion)
    return simulationToResponse(created)
  }
}