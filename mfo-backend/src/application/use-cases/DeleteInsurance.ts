// src/application/use-cases/DeleteInsurance.ts

import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { IDeleteInsuranceUseCase } from './interfaces/IInsuranceUseCases'
import { DeleteInsuranceInput } from '@/application/dtos/InsuranceDTO'

export class DeleteInsurance implements IDeleteInsuranceUseCase {
  constructor(private insurancesRepository: IInsurancesRepository) {}

  async execute(input: DeleteInsuranceInput): Promise<void> {
    const insurance = await this.insurancesRepository.findById(input.insuranceId)
    if (!insurance) throw new Error('Insurance not found.')
    await this.insurancesRepository.delete(input.insuranceId)
  }
}