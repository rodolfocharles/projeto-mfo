import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema'

// SCHEMAS DE REQUEST (Estes estão corretos, não precisam de alteração)
export const AllocationSnapshotItemSchema = z.object({
  allocationId: UUIDSchema.describe('ID da alocação original'),
  valueAtSnapshot: PositiveNumberSchema.describe('Valor da alocação nesta data do snapshot'),
})

export const CreateAllocationSnapshotSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente ao qual o snapshot pertence'),
  date: DateTimeSchema.describe('Data em que o snapshot foi tirado'),
  allocations: z.array(AllocationSnapshotItemSchema).min(1).describe('Lista de alocações e seus valores nesta data'),
})

export const UpdateAllocationSnapshotItemSchema = z.object({
  valueAtSnapshot: PositiveNumberSchema.optional().describe('Novo valor da alocação nesta data do snapshot'),
})

export const SnapshotParamsSchema = z.object({
  id: UUIDSchema.describe('ID do Snapshot principal'),
})

export const AllocationSnapshotItemParamsSchema = z.object({
  id: UUIDSchema.describe('ID do AllocationSnapshotItem'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

// SCHEMAS DE RESPOSTA
export const PrismaAllocationSnapshotItemSchema = z.object({
  id: UUIDSchema,
  snapshotId: UUIDSchema,
  allocationId: UUIDSchema,
  valueAtSnapshot: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export const AllocationSnapshotItemResponseSchema = PrismaAllocationSnapshotItemSchema.transform((data) => ({
  id: data.id,
  snapshotId: data.snapshotId,
  allocationId: data.allocationId,
  valueAtSnapshot: data.valueAtSnapshot,
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
}))

// Schema base do Prisma para Snapshot principal (SEM TRANSFORMAÇÃO AINDA)
// ✅ CORREÇÃO AQUI: Adicionar 'allocationSnapshots' com o tipo Date do Prisma
export const BasePrismaSnapshotSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  date: z.date(),
  totalValue: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  // ✅ AQUI ESTÁ A MUDANÇA CRUCIAL: O nome da propriedade deve ser 'allocationSnapshots'
  //    e o tipo deve ser o schema do Prisma para os itens, não o schema de resposta transformado.
  allocationSnapshots: z.array(PrismaAllocationSnapshotItemSchema),
})

// Schema de resposta da API para Snapshot principal (transformado para strings)
// Este será usado para respostas de GET /:id e POST /
// ✅ ATENÇÃO: Este schema não inclui os itens de alocação. Se um endpoint retornar um Snapshot
//    sem os itens, este schema é o correto. Se retornar com os itens, use FullSnapshotResponseSchema.
export const SnapshotResponseSchema = BasePrismaSnapshotSchema.omit({ allocationSnapshots: true }).transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  date: data.date.toISOString(),
  totalValue: data.totalValue,
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
}))


// Schema de resposta completa para um Snapshot com seus itens de alocação
// AGORA USA BasePrismaSnapshotSchema para o extend, e depois transforma
// ✅ CORREÇÃO AQUI: O .extend não é mais necessário se BasePrismaSnapshotSchema já inclui allocationSnapshots.
//    Apenas transformamos o BasePrismaSnapshotSchema.
export const FullSnapshotResponseSchema = BasePrismaSnapshotSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  date: data.date.toISOString(),
  totalValue: data.totalValue,
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
  // ✅ AQUI ESTÁ A MUDANÇA CRUCIAL: Mapear 'allocationSnapshots' para o schema de resposta dos itens.
  allocationSnapshots: data.allocationSnapshots.map(item => ({
    id: item.id,
    snapshotId: item.snapshotId,
    allocationId: item.allocationId,
    valueAtSnapshot: item.valueAtSnapshot,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
  })),
}))

// Lista de FullSnapshots
export const FullSnapshotListResponseSchema = z.array(FullSnapshotResponseSchema)

// TIPOS TYPESCRIPT
export type CreateAllocationSnapshot = z.infer<typeof CreateAllocationSnapshotSchema>
export type AllocationSnapshotItem = z.infer<typeof AllocationSnapshotItemSchema>
export type UpdateAllocationSnapshotItem = z.infer<typeof UpdateAllocationSnapshotItemSchema>
export type FullSnapshotResponse = z.infer<typeof FullSnapshotResponseSchema>
export type AllocationSnapshotItemResponse = z.infer<typeof AllocationSnapshotItemResponseSchema>
