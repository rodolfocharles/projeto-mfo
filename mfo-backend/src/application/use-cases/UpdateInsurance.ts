// src/application/use-cases/UpdateInsurance.ts

import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { IUpdateInsuranceUseCase } from './interfaces/IInsuranceUseCases'
import { UpdateInsuranceInput, InsuranceResponse } from '@/application/dtos/InsuranceDTO'
import { InsuranceType } from '@/domain/value-objects/InsuranceType'
import { insuranceToResponse } from './helpers/insuranceToResponse'

export class UpdateInsurance implements IUpdateInsuranceUseCase {
  constructor(private insurancesRepository: IInsurancesRepository) {}

  async execute(insuranceId: string, input: UpdateInsuranceInput): Promise<InsuranceResponse> {
    const insurance = await this.insurancesRepository.findById(insuranceId)
    if (!insurance) throw new Error('Insurance not found.')

    if (
      input.name !== undefined ||
      input.type !== undefined ||
      input.coverage !== undefined ||
      input.premium !== undefined ||
      input.startDate !== undefined ||
      input.endDate !== undefined
    ) {
      insurance.updateDetails(
        input.name ?? insurance.name,
        (input.type as InsuranceType) ?? insurance.type,
        input.coverage ?? insurance.coverage,
        input.premium ?? insurance.premium,
        input.startDate ? new Date(input.startDate) : insurance.startDate,
        input.endDate !== undefined ? (input.endDate ? new Date(input.endDate) : null) : insurance.endDate,
      )
    }

    const updated = await this.insurancesRepository.update(insurance)
    return insuranceToResponse(updated)
  }
}