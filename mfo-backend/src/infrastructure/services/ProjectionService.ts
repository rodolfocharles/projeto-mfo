// src/infrastructure/services/ProjectionService.ts

import { IMovementsRepository } from '@/domain/repositories/IMovementsRepository'
import { IInsurancesRepository } from '@/domain/repositories/IInsurancesRepository'
import { ISnapshotsRepository } from '@/domain/repositories/ISnapshotsRepository'
import { IClientRepository } from '@/domain/repositories/IClientRepository'
import { ISimulationsRepository } from '@/domain/repositories/ISimulationsRepository'
import { IProjectionService, ProjectionResultItem } from './IProjectionService'
import { Insurance } from '@/domain/entities/Insurance'
import { Calculator } from '@/utils/calculator'

export class ProjectionService implements IProjectionService {
  constructor(
    private movementsRepository: IMovementsRepository,
    private insurancesRepository: IInsurancesRepository,
    private snapshotsRepository: ISnapshotsRepository,
    private clientRepository: IClientRepository,
    private simulationsRepository: ISimulationsRepository,
  ) {}

  async calculate(
    simulationId: string,
    months: number,
    scenario?: string,
    eventMonth?: number,
  ): Promise<ProjectionResultItem[]> {
    console.log(
      `[ProjectionService] Iniciando cálculo para simulationId: ${simulationId}, months: ${months}, scenario: ${scenario}, eventMonth: ${eventMonth}`,
    )

    // Buscar simulação
    const simulation = await this.simulationsRepository.findById(simulationId)
    if (!simulation) {
      throw new Error('Simulation not found')
    }

    // Buscar snapshot mais recente do cliente
    const latestSnapshot = await this.snapshotsRepository.findLatestByClientId(
      simulation.clientId,
    )

    if (!latestSnapshot) {
      throw new Error(
        'No client snapshot found for projection. Please create a snapshot for the client.',
      )
    }

    // Valores iniciais do snapshot
    let currentFinancialValue = latestSnapshot.financialValue ?? 0
    let currentImmobilizedValue = latestSnapshot.immobilizedValue ?? 0
    let currentTotalNoInsValue = currentFinancialValue + currentImmobilizedValue

    // Taxas do snapshot
    const monthlyInterestRate = (latestSnapshot.monthlyInterestRate ?? 0) / 100
    const monthlyInflationRate = (latestSnapshot.monthlyInflationRate ?? 0) / 100

    // Buscar cliente para data de nascimento
    const client = await this.clientRepository.findById(simulation.clientId)
    if (!client) {
      throw new Error('Client not found')
    }

    // Buscar movimentações e seguros do cliente
    const movements = await this.movementsRepository.findByClientId(simulation.clientId)
    const insurances = await this.insurancesRepository.findByClientId(simulation.clientId)

    const results: ProjectionResultItem[] = []
    let currentPeriod = new Date(simulation.startDate)
    let currentYear = currentPeriod.getFullYear()
    let accumulatedIncome = 0
    let accumulatedExpenses = 0
    let accumulatedInvestments = 0

    for (let i = 0; i < months; i++) {
      currentPeriod = Calculator.addMonths(currentPeriod, 1)
      currentYear = currentPeriod.getFullYear()
      const currentMonth = currentPeriod.getMonth() + 1

      // Calcular idade
      let age: number | undefined; // Declare 'age' para aceitar undefined
      if (client.birthDate) {
        age = Calculator.calculateAge(client.birthDate, currentPeriod);
      } else {
        // Se client.birthDate for undefined, você precisa decidir o que fazer.
        // Por exemplo, pode definir uma idade padrão (ex: 0), ou deixar como undefined.
        // Por enquanto, vamos deixar como undefined.
        age = undefined; // Ou 0, ou alguma outra lógica padrão para clientes sem data de nascimento
      }

      // Filtrar movimentações ativas e aplicar inflação
      const activeMovements = movements
        .filter(m => Calculator.isMovementActive(m, currentPeriod))
        .map(m => ({
          ...m,
          value: Calculator.applyInflation(m.value, monthlyInflationRate, i),
        }))

      // Filtrar seguros ativos e aplicar inflação
      const activeInsurances: Insurance[] = insurances
      .filter((ins: Insurance) => Calculator.isInsuranceActive(ins, currentPeriod))
      .map((ins: Insurance) => {
        console.log('Insurance being processed:', {
          id: ins.id,
          name: ins.name,
          nameLength: ins.name?.length,
          nameType: typeof ins.name,
        });

        return Insurance.create({
          id: ins.id,
          clientId: ins.clientId,
          type: ins.type,
          name: ins.name,
          startDate: ins.startDate,
          endDate: ins.endDate === undefined ? null : ins.endDate,
          createdAt: ins.createdAt,
          updatedAt: ins.updatedAt,
          premium: Calculator.applyInflation(ins.premium, monthlyInflationRate, i),
          coverage: Calculator.applyInflation(ins.coverage, monthlyInflationRate, i),
        });
      });

      // Calcular receitas e despesas
      let income = 0
      let expense = 0
      let premiumsToPay = 0

      for (const movement of activeMovements) {
        if (movement.type === 'INCOME') {
          income += movement.value
        } else {
          expense += movement.value
        }
      }

      for (const insurance of activeInsurances) {
        premiumsToPay += insurance.premium
      }
      expense += premiumsToPay

      // Aplicar juros compostos
      currentFinancialValue = Calculator.compound(
        currentFinancialValue,
        monthlyInterestRate,
        1,
      )

      // Adicionar/subtrair movimentações
      currentFinancialValue += income
      currentFinancialValue -= expense

      // Acumular valores
      accumulatedIncome += income
      accumulatedExpenses += expense
      accumulatedInvestments += income - expense

      // Garantir que não sejam NaN
      const financial = isNaN(currentFinancialValue)
        ? 0
        : Math.round(currentFinancialValue * 100) / 100
      const immobilized = isNaN(currentImmobilizedValue)
        ? 0
        : Math.round(currentImmobilizedValue * 100) / 100
      const total = isNaN(financial + immobilized)
        ? 0
        : Math.round((financial + immobilized) * 100) / 100
      const totalNoIns = isNaN(currentTotalNoInsValue)
        ? 0
        : Math.round(currentTotalNoInsValue * 100) / 100

      // Calcular valor de seguro recebido (se evento ocorrer)
      let insuranceValueReceived = 0
      if (
        eventMonth !== null &&
        eventMonth !== undefined &&
        currentMonth === eventMonth &&
        scenario === 'DECEASED'
      ) {
        const lifeInsurance = activeInsurances.find(ins => ins.type === 'LIFE')
        insuranceValueReceived = lifeInsurance?.coverage ?? 0
      }

      results.push({
        simulationId,
        period: currentPeriod,
        financial,
        immobilized,
        total,
        totalNoIns,
        income: Math.round(income * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        year: currentYear,
        age,
        accumulatedIncome: Math.round(accumulatedIncome * 100) / 100,
        accumulatedExpenses: Math.round(accumulatedExpenses * 100) / 100,
        accumulatedInvestments: Math.round(accumulatedInvestments * 100) / 100,
        insurancePremiumPaid: Math.round(premiumsToPay * 100) / 100,
        insuranceValueReceived,
        totalInsuranceValue: activeInsurances.reduce(
          (sum, ins) => sum + ins.coverage,
          0,
        ),
      })
    }

    return results
  }
}