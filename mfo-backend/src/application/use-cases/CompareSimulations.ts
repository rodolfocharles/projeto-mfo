// src/application/use-cases/CompareSimulations.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { ICompareSimulationsUseCase } from './interfaces/ISimulationUseCases'
import { CompareSimulationsInput, CompareSimulationResponse } from '@/application/dtos/SimulationDTO'
import { IProjectionService } from '@/infrastructure/services/IProjectionService'

export class CompareSimulations implements ICompareSimulationsUseCase {
  constructor(
    private simulationsRepository: ISimulationsRepository,
    private projectionService: IProjectionService,
  ) {}

  async execute(input: CompareSimulationsInput): Promise<CompareSimulationResponse> {
    const [sim1, sim2] = await Promise.all([
      this.simulationsRepository.findById(input.id1),
      this.simulationsRepository.findById(input.id2),
    ])

    if (!sim1) throw new Error('First simulation not found.')
    if (!sim2) throw new Error('Second simulation not found.')

    const [projection1, projection2] = await Promise.all([
      this.projectionService.calculate(input.id1, input.months, input.scenario, input.eventMonth),
      this.projectionService.calculate(input.id2, input.months, input.scenario, input.eventMonth),
    ])

    const comparison = projection1
      .map((p1, index) => {
        const p2 = projection2[index]
        if (!p2) return null

        return {
          month: index,
          period: p1.period,
          simulation1: {
            total: p1.total,
            financial: p1.financial,
            immobilized: p1.immobilized,
          },
          simulation2: {
            total: p2.total,
            financial: p2.financial,
            immobilized: p2.immobilized,
          },
          difference: {
            total: Math.round((p1.total - p2.total) * 100) / 100,
            financial: Math.round((p1.financial - p2.financial) * 100) / 100,
            immobilized: Math.round((p1.immobilized - p2.immobilized) * 100) / 100,
          },
        }
      })
      .filter(Boolean)

    return {
      simulation1: {
        id: sim1.id,
        name: sim1.name,
        version: sim1.version,
        realRate: sim1.realRate,
        inflation: sim1.inflation,
      },
      simulation2: {
        id: sim2.id,
        name: sim2.name,
        version: sim2.version,
        realRate: sim2.realRate,
        inflation: sim2.inflation,
      },
      comparison: comparison as any,
    }
  }
}