// src/lib/schemas/allocation-snapshot.schema.ts
import { z } from 'zod'
import {
    UUIDSchema,
    DateTimeSchema,
    PositiveNumberSchema,
    ErrorResponseSchema, // Não usado aqui, mas ok
} from './common.schema'

// SCHEMAS DE REQUEST
export const AllocationSnapshotItemSchema = z.object({
    allocationId: UUIDSchema.describe('ID da alocação original'),
    valueAtSnapshot: PositiveNumberSchema.describe('Valor da alocação nesta data do snapshot'),
})

export const CreateAllocationSnapshotSchema = z.object({
    clientId: UUIDSchema.describe('ID do cliente ao qual o snapshot pertence'),
    date: DateTimeSchema.describe('Data em que o snapshot foi tirada'),
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

export const BasePrismaSnapshotSchema = z.object({
    id: UUIDSchema,
    clientId: UUIDSchema,
    date: z.date(),
    totalValue: z.number(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    allocationSnapshots: z.array(PrismaAllocationSnapshotItemSchema),
})

export const FullSnapshotResponseSchema = BasePrismaSnapshotSchema.transform((data) => ({
    id: data.id,
    clientId: data.clientId,
    date: data.date.toISOString(),
    totalValue: data.totalValue,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
    allocationSnapshots: data.allocationSnapshots.map(item => ({
    id: item.id,
    snapshotId: item.snapshotId,
    allocationId: item.allocationId,
    valueAtSnapshot: item.valueAtSnapshot,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    })),
}))

export const FullSnapshotListResponseSchema = z.array(FullSnapshotResponseSchema)

// TIPOS TYPESCRIPT
export type CreateAllocationSnapshot = z.infer<typeof CreateAllocationSnapshotSchema>
export type AllocationSnapshotItem = z.infer<typeof AllocationSnapshotItemSchema>
export type UpdateAllocationSnapshotItem = z.infer<typeof UpdateAllocationSnapshotItemSchema>
export type FullSnapshotResponse = z.infer<typeof FullSnapshotResponseSchema>
export type AllocationSnapshotItemResponse = z.infer<typeof AllocationSnapshotItemResponseSchema>
