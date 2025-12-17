/**
 * Helpers para transformar objetos do Prisma (com Date)
 * em objetos prontos para API (com strings ISO 8601)
 */

/**
 * Converte Date para ISO string ou retorna null
 */
export function dateToISO(date: Date | null | undefined): string | null {
  return date ? date.toISOString() : null
}

/**
 * Transforma Insurance do Prisma para API
 */
export function transformInsurance(insurance: any) {
  return {
    id: insurance.id,
    clientId: insurance.clientId,
    type: insurance.type,
    name: insurance.name,
    startDate: insurance.startDate.toISOString(),
    durationMonths: insurance.durationMonths,
    monthlyPremium: insurance.monthlyPremium,
    insuredAmount: insurance.insuredAmount,
    createdAt: insurance.createdAt.toISOString(),
  }
}

/**
 * Transforma Client do Prisma para API
 */
export function transformClient(client: any) {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    monthlyIncome: client.monthlyIncome,
    birthDate: dateToISO(client.birthDate),
    cpf: client.cpf,
    createdAt: client.createdAt.toISOString(),
    updatedAt: dateToISO(client.updatedAt),
  }
}

/**
 * Transforma Movement do Prisma para API
 */
export function transformMovement(movement: any) {
  return {
    id: movement.id,
    clientId: movement.clientId,
    name: movement.name,
    type: movement.type,
    value: movement.value,
    startDate: movement.startDate.toISOString(),
    endDate: dateToISO(movement.endDate),
    frequency: movement.frequency,
    indexation: movement.indexation,
    createdAt: movement.createdAt.toISOString(),
  }
}

/**
 * Transforma Simulation do Prisma para API
 */
export function transformSimulation(simulation: any) {
  return {
    id: simulation.id,
    clientId: simulation.clientId,
    name: simulation.name,
    startDate: simulation.startDate.toISOString(),
    realRate: simulation.realRate,
    inflation: simulation.inflation,
    lifeStatus: simulation.lifeStatus,
    version: simulation.version,
    createdAt: simulation.createdAt.toISOString(),
  }
}

/**
 * Transforma Allocation do Prisma para API
 */
export function transformAllocation(allocation: any) {
  return {
    id: allocation.id,
    clientId: allocation.clientId,
    date: allocation.date.toISOString(),
    allocations: allocation.allocations,
    createdAt: allocation.createdAt.toISOString(),
  }
}

/**
 * Transforma AllocationItem do Prisma para API
 */
export function transformAllocationItem(item: any) {
  return {
    id: item.id,
    snapshotId: item.snapshotId,
    name: item.name,
    value: item.value,
    type: item.type,
    isFinanced: item.isFinanced,
    financing: item.financing,
  }
}

/**
 * Transforma History do Prisma para API
 */
export function transformHistory(history: any) {
  return {
    id: history.id,
    clientId: history.clientId,
    action: history.action,
    resource: history.resource,
    resourceId: history.resourceId,
    description: history.description,
    metadata: history.metadata,
    createdAt: history.createdAt.toISOString(),
  }
}
