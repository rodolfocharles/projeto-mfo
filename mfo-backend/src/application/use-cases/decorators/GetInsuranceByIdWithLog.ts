// src/application/use-cases/decorators/GetInsuranceByIdWithLog.ts

import { IGetInsuranceByIdUseCase } from '../interfaces/IInsuranceUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { GetInsuranceByIdInput, InsuranceResponse } from '@/application/dtos/InsuranceDTO'

export class GetInsuranceByIdWithLog implements IGetInsuranceByIdUseCase {
  constructor(
    private getInsuranceById: IGetInsuranceByIdUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: GetInsuranceByIdInput): Promise<InsuranceResponse> {
    try {
      return await this.getInsuranceById.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[GetInsuranceById] Falha ao buscar seguro ${input.insuranceId}: ${error.message}`,
        { insuranceId: input.insuranceId, error }
      )
      throw error
    }
  }
}