// src/infrastructure/services/IRealizedService.ts

export interface RealizedResultItem {
  date: Date
  financial: number
  immobilized: number
  total: number
}

export interface IRealizedService {
  calculate(clientId: string): Promise<RealizedResultItem[]>
}