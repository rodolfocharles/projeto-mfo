import { z } from 'zod'
import {
  MovementTypeEnum,
  FrequencyEnum,
  IndexationEnum,
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema'

// SCHEMAS DE REQUEST (estes estão corretos, não precisam de alteração)
export const CreateMovementSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente'),
  name: z.string().min(1).describe('Nome da movimentação'),
  type: MovementTypeEnum.describe('Tipo (INCOME ou EXPENSE)'),
  value: PositiveNumberSchema.describe('Valor mensal'),
  startDate: DateTimeSchema.describe('Data de início'),
  endDate: DateTimeSchema.optional().describe('Data de término'),
  frequency: FrequencyEnum.describe('Frequência'),
  indexation: IndexationEnum.describe('Indexação'),
})

export const UpdateMovementSchema = z.object({
  name: z.string().min(1).optional().describe('Novo nome'),
  type: MovementTypeEnum.optional().describe('Novo tipo'),
  value: PositiveNumberSchema.optional().describe('Novo valor'),
  startDate: DateTimeSchema.optional().describe('Nova data de início'),
  endDate: DateTimeSchema.optional().describe('Nova data de término'),
  frequency: FrequencyEnum.optional().describe('Nova frequência'),
  indexation: IndexationEnum.optional().describe('Nova indexação'),
})

export const MovementParamsSchema = z.object({
  id: UUIDSchema.describe('ID da movimentação'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

// SCHEMAS DE RESPOSTA 
// Schema base do Prisma (o que o Prisma retorna)
export const PrismaMovementSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  name: z.string(),
  type: z.string(),
  value: z.number(),
  startDate: z.date(), // Prisma retorna Date
  endDate: z.date().nullable(), // Prisma retorna Date ou null
  isRecurrent: z.boolean(), // Campo real no Prisma
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable().optional(), // Se você tiver updatedAt no seu model
})

// Schema de resposta da API (transformado para strings e sem frequency/indexation)
// Garante que MovementResponseSchema seja totalmente definido antes de ser usado
export const MovementResponseSchema = PrismaMovementSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  name: data.name,
  type: data.type,
  value: data.value,
  startDate: data.startDate.toISOString(), // Transforma Date para string
  endDate: data.endDate ? data.endDate.toISOString() : null, // Transforma Date para string
  isRecurrent: data.isRecurrent, // Campo real
  createdAt: data.createdAt.toISOString(), // Transforma Date para string
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null, // Transforma Date para string
}))

//Agora MovementResponseSchema está definido e pode ser usado
export const MovementListResponseSchema = z.array(MovementResponseSchema)

// TIPOS TYPESCRIPT
export type CreateMovement = z.infer<typeof CreateMovementSchema>
export type UpdateMovement = z.infer<typeof UpdateMovementSchema>
export type MovementResponse = z.infer<typeof MovementResponseSchema>
