// src/application/use-cases/decorators/ListClientInsurancesWithLog.ts

import { IListClientInsurancesUseCase } from '../interfaces/IInsuranceUseCases'
import { ILogger } from '@/domain/services/ILogger'
import { ListClientInsurancesInput, InsuranceListResponse } from '@/application/dtos/InsuranceDTO'

export class ListClientInsurancesWithLog implements IListClientInsurancesUseCase {
  constructor(
    private listClientInsurances: IListClientInsurancesUseCase,
    private logger: ILogger,
  ) {}

  async execute(input: ListClientInsurancesInput): Promise<InsuranceListResponse> {
    try {
      return await this.listClientInsurances.execute(input)
    } catch (error: any) {
      this.logger.error(
        `[ListClientInsurances] Falha ao listar seguros do cliente ${input.clientId}: ${error.message}`,
        { clientId: input.clientId, error }
      )
      throw error
    }
  }
}