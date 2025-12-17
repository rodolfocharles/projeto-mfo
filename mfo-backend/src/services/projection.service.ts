import { prisma } from '../db/prisma'
import { Calculator } from '../utils/calculator'

export class ProjectionService {
  async calculate(simulationId: string) {
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        client: {
          include: {
            snapshots: {
              include: { allocations: true },
              orderBy: { date: 'asc' },
            },
            movements: true,
            insurances: true,
          },
        },
      },
    })

    if (!simulation) throw new Error('Simulation not found')

    const startDate = new Date(simulation.startDate)
    const endDate = Calculator.addMonths(startDate, 360)
    const periods: Date[] = []

    let current = startDate
    while (current <= endDate) {
      periods.push(new Date(current))
      current = Calculator.addMonths(current, 1)
    }

    const initialSnapshot = simulation.client.snapshots.find(
      (s) => new Date(s.date) <= startDate
    )

    let financial = initialSnapshot?.allocations
      .filter((a) => a.type === 'FINANCIAL')
      .reduce((sum, a) => sum + a.value, 0) || 0

    let immobilized = initialSnapshot?.allocations
      .filter((a) => a.type === 'IMMOBILIZED')
      .reduce((sum, a) => sum + a.value, 0) || 0

    const results = []
    const monthlyRate = simulation.realRate / 12 / 100

    for (const period of periods) {
      const movements = simulation.client.movements.filter((m) => {
        const start = new Date(m.startDate)
        const end = m.endDate ? new Date(m.endDate) : endDate
        return period >= start && period <= end
      })

      let income = 0
      let expense = 0

      if (simulation.lifeStatus === 'NORMAL') {
        income = movements
          .filter((m) => m.type === 'INCOME')
          .reduce((sum, m) => sum + m.value, 0)
        expense = movements
          .filter((m) => m.type === 'EXPENSE')
          .reduce((sum, m) => sum + m.value, 0)
      } else if (simulation.lifeStatus === 'DECEASED') {
        expense = movements
          .filter((m) => m.type === 'EXPENSE')
          .reduce((sum, m) => sum + m.value, 0) / 2
      } else if (simulation.lifeStatus === 'DISABLED') {
        expense = movements
          .filter((m) => m.type === 'EXPENSE')
          .reduce((sum, m) => sum + m.value, 0)
      }

      const activeInsurances = simulation.client.insurances.filter((ins) => {
        const start = new Date(ins.startDate)
        const end = Calculator.addMonths(start, ins.durationMonths)
        return period >= start && period <= end
      })

      const insurancePremium = activeInsurances.reduce(
        (sum, ins) => sum + ins.monthlyPremium,
        0
      )

      financial += income - expense - insurancePremium
      financial = Calculator.compound(financial, monthlyRate, 1)

      const total = financial + immobilized
      const totalNoIns = total

      results.push({
        simulationId,
        period,
        financial,
        immobilized,
        total,
        totalNoIns,
      })
    }

    await prisma.projectionResult.deleteMany({ where: { simulationId } })
    await prisma.projectionResult.createMany({ data: results })

    return results
  }
}
