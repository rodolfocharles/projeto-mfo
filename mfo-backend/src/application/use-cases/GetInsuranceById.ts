// src/application/use-cases/GetInsuranceById.ts

import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { IGetInsuranceByIdUseCase } from './interfaces/IInsuranceUseCases'
import { GetInsuranceByIdInput, InsuranceResponse } from '@/application/dtos/InsuranceDTO'
import { insuranceToResponse } from './helpers/insuranceToResponse'

export class GetInsuranceById implements IGetInsuranceByIdUseCase {
  constructor(private insurancesRepository: IInsurancesRepository) {}

  async execute(input: GetInsuranceByIdInput): Promise<InsuranceResponse> {
    const insurance = await this.insurancesRepository.findById(input.insuranceId)
    if (!insurance) throw new Error('Insurance not found.')
    return insuranceToResponse(insurance)
  }
}