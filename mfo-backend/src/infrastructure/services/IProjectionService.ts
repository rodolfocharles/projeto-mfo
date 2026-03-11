// src/infrastructure/services/IProjectionService.ts

export interface ProjectionResultItem {
  simulationId: string
  period: Date
  financial: number
  immobilized: number
  total: number
  totalNoIns: number
  income: number
  expense: number
  year: number
  age: number | undefined
  accumulatedIncome: number
  accumulatedExpenses: number
  accumulatedInvestments: number
  insurancePremiumPaid: number
  insuranceValueReceived: number
  totalInsuranceValue: number
}

export interface IProjectionService {
  calculate(
    simulationId: string,
    months: number,
    scenario?: string,
    eventMonth?: number,
  ): Promise<ProjectionResultItem[]>
}