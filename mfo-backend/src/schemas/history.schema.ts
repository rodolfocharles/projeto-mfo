import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  ErrorResponseSchema,
  PositiveNumberSchema,
  NonNegativeNumberSchema,
} from './common.schema'

// ============================================
// SCHEMAS DE PARÂMETROS
// ============================================

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

export const SimulationParamsSchema = z.object({
  id: UUIDSchema.describe('ID da simulação'),
})

// ============================================
// SCHEMAS DE RESPOSTA PARA SIMULAÇÕES
// ============================================

// Schema base do Prisma para Simulation (com tipos Date)
export const PrismaSimulationHistorySchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  name: z.string(),
  version: z.number().int(),
  startDate: z.date(), // Prisma retorna Date
  realRate: z.number(),
  inflation: z.number(),
  lifeStatus: z.string(),
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable(), // Prisma retorna Date ou null
  // Não incluímos 'results' aqui para manter a resposta mais leve para o histórico,
  // mas podemos adicionar se for necessário para a visualização dos gráficos antigos.
})

// Schema de resposta da API para Simulation (transformado para strings ISO)
export const SimulationHistoryResponseSchema = PrismaSimulationHistorySchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  name: data.name,
  version: data.version,
  startDate: data.startDate.toISOString(), // Converte Date para string ISO
  realRate: data.realRate,
  inflation: data.inflation,
  lifeStatus: data.lifeStatus,
  createdAt: data.createdAt.toISOString(), // Converte Date para string ISO
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null, // Converte Date para string ISO ou null
}))

// Schema para uma lista de históricos de simulações
export const SimulationHistoryListResponseSchema = z.array(SimulationHistoryResponseSchema)

// ============================================
// SCHEMAS DE RESPOSTA PARA ALLOCATION SNAPSHOTS (Patrimônio Realizado)
// ============================================

// Reutilizamos os schemas de AllocationSnapshot para o histórico de patrimônio
// Importe-os de src/schemas/allocation-snapshot.schema.ts
import {
  AllocationSnapshotItemResponseSchema,
  FullSnapshotResponseSchema,
} from './allocation-snapshot.schema'

// O FullSnapshotResponseSchema já é adequado para o histórico de patrimônio
export const RealizedPatrimonyHistoryResponseSchema = FullSnapshotResponseSchema
export const RealizedPatrimonyHistoryListResponseSchema = z.array(RealizedPatrimonyHistoryResponseSchema)


// ============================================
// TIPOS TYPESCRIPT
// ============================================
export type SimulationHistoryResponse = z.infer<typeof SimulationHistoryResponseSchema>
export type RealizedPatrimonyHistoryResponse = z.infer<typeof RealizedPatrimonyHistoryResponseSchema>
export { ErrorResponseSchema }