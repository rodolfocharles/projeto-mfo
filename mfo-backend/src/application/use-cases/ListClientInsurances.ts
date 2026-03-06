// src/application/use-cases/ListClientInsurances.ts

import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { IListClientInsurancesUseCase } from './interfaces/IInsuranceUseCases'
import { ListClientInsurancesInput, InsuranceListResponse } from '@/application/dtos/InsuranceDTO'
import { insuranceToResponse } from './helpers/insuranceToResponse'

export class ListClientInsurances implements IListClientInsurancesUseCase {
  constructor(
    private insurancesRepository: IInsurancesRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: ListClientInsurancesInput): Promise<InsuranceListResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const insurances = await this.insurancesRepository.findByClientId(input.clientId)
    return insurances.map(insuranceToResponse)
  }
}