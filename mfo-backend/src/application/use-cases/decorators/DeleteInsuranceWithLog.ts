// src/application/use-cases/decorators/DeleteInsuranceWithLog.ts

import { IDeleteInsuranceUseCase } from '../interfaces/IInsuranceUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { DeleteInsuranceInput } from '@/application/dtos/InsuranceDTO'

export class DeleteInsuranceWithLog implements IDeleteInsuranceUseCase {
  constructor(
    private deleteInsurance: IDeleteInsuranceUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: DeleteInsuranceInput): Promise<void> {
    try {
      await this.deleteInsurance.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[DeleteInsurance] Falha ao deletar seguro ${input.insuranceId}: ${error.message}`,
        { insuranceId: input.insuranceId, error }
      )
      throw error
    }
  }
}