// src/application/use-cases/ListClientSimulations.ts

import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { IListClientSimulationsUseCase } from './interfaces/ISimulationUseCases'
import { ListClientSimulationsInput, SimulationListResponse } from '@/application/dtos/SimulationDTO'
import { simulationToResponse } from './helpers/simulationToResponse'

export class ListClientSimulations implements IListClientSimulationsUseCase {
  constructor(
    private simulationsRepository: ISimulationsRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: ListClientSimulationsInput): Promise<SimulationListResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const simulations = await this.simulationsRepository.findByClientId(input.clientId)
    return simulations.map(simulationToResponse)
  }
}