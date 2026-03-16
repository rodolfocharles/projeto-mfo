// src/application/use-cases/CreateInsurance.ts

import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { ICreateInsuranceUseCase } from './interfaces/IInsuranceUseCases'
import { CreateInsuranceInput, InsuranceResponse } from '@/application/dtos/InsuranceDTO'
import { Insurance } from '@/domain/entities/Insurance'
import { insuranceToResponse } from './helpers/insuranceToResponse'

export class CreateInsurance implements ICreateInsuranceUseCase {
  constructor(
    private insurancesRepository: IInsurancesRepository,
    private clientRepository: IClientRepository,
  ) {}

  async execute(input: CreateInsuranceInput): Promise<InsuranceResponse> {
    const client = await this.clientRepository.findById(input.clientId)
    if (!client) throw new Error('Client not found.')

    const insurance = Insurance.create({
      clientId: input.clientId,
      type: input.type,
      name: input.name,
      coverage: input.coverage,
      premium: input.premium,
      // zod returns string for DateTimeSchema; convert to Date object
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    })

    const created = await this.insurancesRepository.create(insurance)
    return insuranceToResponse(created)
  }
}