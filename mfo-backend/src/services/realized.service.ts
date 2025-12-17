import { prisma } from '../db/prisma'

export class RealizedService {
  async calculate(clientId: string) {
    const snapshots = await prisma.snapshot.findMany({
      where: { clientId },
      include: { allocations: true },
      orderBy: { date: 'asc' },
    })

    return snapshots.map((snapshot) => {
      const financial = snapshot.allocations
        .filter((a) => a.type === 'FINANCIAL')
        .reduce((sum, a) => sum + a.value, 0)

      const immobilized = snapshot.allocations
        .filter((a) => a.type === 'IMMOBILIZED')
        .reduce((sum, a) => sum + a.value, 0)

      return {
        date: snapshot.date,
        financial,
        immobilized,
        total: financial + immobilized,
      }
    })
  }
}
