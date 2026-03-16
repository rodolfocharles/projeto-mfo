// src/application/use-cases/decorators/UpdateInsuranceWithLog.ts

import { IUpdateInsuranceUseCase } from '../interfaces/IInsuranceUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { UpdateInsuranceInput, InsuranceResponse } from '@/application/dtos/InsuranceDTO'

export class UpdateInsuranceWithLog implements IUpdateInsuranceUseCase {
  constructor(
    private updateInsurance: IUpdateInsuranceUseCase,
    private logger: ILogger,
  ) {}

  async execute(insuranceId: string, input: UpdateInsuranceInput): Promise<InsuranceResponse> {
    try {
      return await this.updateInsurance.execute(insuranceId, input)
    } catch (error: any) {
      this.logger.error(
        `[UpdateInsurance] Falha ao atualizar seguro ${insuranceId}: ${error.message}`,
        { insuranceId, error }
      )
      throw error
    }
  }
}