// src/application/use-cases/decorators/CreateInsuranceWithLog.ts

import { ICreateInsuranceUseCase } from '../interfaces/IInsuranceUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { CreateInsuranceInput, InsuranceResponse } from '@/application/dtos/InsuranceDTO'

export class CreateInsuranceWithLog implements ICreateInsuranceUseCase {
  constructor(
    private createInsurance: ICreateInsuranceUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: CreateInsuranceInput): Promise<InsuranceResponse> {
    try {
      return await this.createInsurance.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[CreateInsurance] Falha ao criar seguro para cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, insuranceName: input.name, error }
      )
      throw error
    }
  }
}