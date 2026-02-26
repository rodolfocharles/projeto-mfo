// mfo-backend/src/services/projection.service.ts

import { prisma } from '../db/prisma'
import { Calculator } from '../utils/calculator'
import { z } from 'zod'
import { ProjectionQuerySchema } from '../schemas/simulation.schema'
import { ProjectionResult, ScenarioType } from '@prisma/client' // Importe ProjectionResult e ScenarioType

// Defina um tipo para a simulação com as inclusões necessárias
type SimulationWithIncludes = Awaited<ReturnType<typeof prisma.simulation.findUnique>> & {
  client: {
    snapshots: {
      allocationSnapshots: any[]; // Ajuste o tipo conforme seu schema
    }[];
    movements: any[]; // Ajuste o tipo conforme seu schema
    insurances: any[]; // Ajuste o tipo conforme seu schema
  };
};

export class ProjectionService {
  async calculate(
    simulationId: string,
    months: number,
    scenario: ScenarioType,
    eventMonth: number | null,
  ): Promise<ProjectionResult[]> {
    console.log(`[ProjectionService] Iniciando cálculo para simulationId: ${simulationId}, months: ${months}, scenario: ${scenario}, eventMonth: ${eventMonth}`);

    const simulation = await prisma.simulation.findUnique({
      where: {
        id: simulationId,
      },
      include: {
        client: {
          include: {
            snapshots: {
              include: {
                allocationSnapshots: true,
              },
              orderBy: {
                date: 'desc',
              },
              take: 1,
            },
            movements: true,
            insurances: true,
          },
        },
        results: true, // Inclua os resultados se precisar deles para algo, senão pode remover
      },
    }) as SimulationWithIncludes; // Cast para o tipo com includes

    if (!simulation) {
      console.log(`[ProjectionService] Simulação com ID ${simulationId} não encontrada.`);
      throw new Error('Simulation not found');
    }

    const latestSnapshot = simulation.client?.snapshots?.[0];

    if (!latestSnapshot) {
      console.log(`[ProjectionService] Nenhum snapshot encontrado para o cliente da simulação ${simulationId}. A projeção requer um snapshot inicial.`);
      throw new Error('No client snapshot found for projection. Please create a snapshot for the client.');
    }

    // Valores iniciais do snapshot
    let currentFinancialValue = latestSnapshot.financialValue ?? 0; // Use ?? 0 para garantir que não é NaN/undefined
    let currentImmobilizedValue = latestSnapshot.immobilizedValue ?? 0; // Use ?? 0
    let currentTotalValue = currentFinancialValue + currentImmobilizedValue;
    let currentTotalNoInsValue = currentTotalValue; // Assumindo que totalNoIns começa igual ao total

    // Taxas do snapshot (garantindo que sejam números)
    const monthlyInterestRate = (latestSnapshot.monthlyInterestRate ?? 0) / 100; // Convertendo para decimal
    const monthlyInflationRate = (latestSnapshot.monthlyInflationRate ?? 0) / 100; // Convertendo para decimal

    const clientBirthDate = simulation.client.birthDate; // Assumindo que client.birthDate existe

    const results: ProjectionResult[] = [];
    let currentPeriod = new Date(simulation.startDate); // Usar a data de início da simulação
    let currentYear = currentPeriod.getFullYear();

    for (let i = 0; i < months; i++) {
      currentPeriod = Calculator.addMonths(currentPeriod, 1);
      currentYear = currentPeriod.getFullYear();
      const currentMonth = currentPeriod.getMonth() + 1; // Mês de 1 a 12

      // Calcular a idade para o período atual
      const age = Calculator.calculateAge(clientBirthDate, currentPeriod);

      // Aplicar inflação às movimentações e seguros (se aplicável)
      const movements = simulation.client.movements.map(m => ({
        ...m,
        value: Calculator.applyInflation(m.value, monthlyInflationRate, i), // 'i' é o número de meses passados
      }));

      const insurances = simulation.client.insurances.map(ins => ({
        ...ins,
        premium: Calculator.applyInflation(ins.premium, monthlyInflationRate, i),
        insuredAmount: Calculator.applyInflation(ins.insuredAmount, monthlyInflationRate, i),
      }));

      // Calcular receitas e despesas para o mês atual
      let income = 0;
      let expense = 0;
      let premiumsToPay = 0;

      for (const movement of movements) {
        if (Calculator.isMovementActive(movement, currentPeriod)) {
          if (movement.type === 'INCOME') {
            income += movement.value;
          } else {
            expense += movement.value;
          }
        }
      }

      for (const insurance of insurances) {
        if (Calculator.isInsuranceActive(insurance, currentPeriod)) {
          premiumsToPay += insurance.premium;
        }
      }
      expense += premiumsToPay; // Prêmios de seguro são despesas

      // Aplicar juros compostos ao valor financeiro
      currentFinancialValue = Calculator.compound(currentFinancialValue, monthlyInterestRate, 1);

      // Adicionar/subtrair movimentações
      currentFinancialValue += income;
      currentFinancialValue -= expense;

      // Garantir que os valores não sejam NaN antes de arredondar e salvar
      const financial = isNaN(currentFinancialValue) ? 0 : Math.round(currentFinancialValue * 100) / 100;
      const immobilized = isNaN(currentImmobilizedValue) ? 0 : Math.round(currentImmobilizedValue * 100) / 100;
      const total = isNaN(financial + immobilized) ? 0 : Math.round((financial + immobilized) * 100) / 100;
      const totalNoIns = isNaN(currentTotalNoInsValue) ? 0 : Math.round(currentTotalNoInsValue * 100) / 100; // Ajuste conforme sua lógica

      results.push({
        simulationId: simulation.id,
        period: currentPeriod,
        financial: financial,
        immobilized: immobilized,
        total: total,
        totalNoIns: totalNoIns,
        income: Math.round(income * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        year: currentYear,
        age: age, // <-- NOVO: Adicionando o campo 'age'
        accumulatedIncome: 0, // Ajuste a lógica para calcular isso
        accumulatedExpenses: 0, // Ajuste a lógica para calcular isso
        accumulatedInvestments: 0, // Ajuste a lógica para calcular isso
        insurancePremiumPaid: Math.round(premiumsToPay * 100) / 100,
        insuranceValueReceived: (eventMonth !== null && currentMonth === eventMonth && scenario === 'DECEASED') ? (insurances.find(ins => ins.type === 'LIFE')?.insuredAmount || 0) : 0,
        totalInsuranceValue: 0, // Ajuste a lógica para calcular isso
      });
    }

    await prisma.projectionResult.deleteMany({ where: { simulationId } });
    await prisma.projectionResult.createMany({ data: results });
    return results;
  }
}
