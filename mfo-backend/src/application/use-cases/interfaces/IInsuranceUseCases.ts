// src/application/use-cases/interfaces/IInsuranceUseCases.ts

import {
  CreateInsuranceInput,
  UpdateInsuranceInput,
  InsuranceResponse,
  InsuranceListResponse,
  GetInsuranceByIdInput,
  DeleteInsuranceInput,
  ListClientInsurancesInput,
} from '@/application/dtos/InsuranceDTO'

export interface ICreateInsuranceUseCase {
  execute(input: CreateInsuranceInput): Promise<InsuranceResponse>
}

export interface IListClientInsurancesUseCase {
  execute(input: ListClientInsurancesInput): Promise<InsuranceListResponse>
}

export interface IGetInsuranceByIdUseCase {
  execute(input: GetInsuranceByIdInput): Promise<InsuranceResponse>
}

export interface IUpdateInsuranceUseCase {
  execute(insuranceId: string, input: UpdateInsuranceInput): Promise<InsuranceResponse>
}

export interface IDeleteInsuranceUseCase {
  execute(input: DeleteInsuranceInput): Promise<void>
}