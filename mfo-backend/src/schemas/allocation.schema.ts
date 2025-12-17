import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema'

// SCHEMAS DE REQUEST
export const CreateAllocationSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente ao qual a alocação pertence'),
  name: z.string().min(1).describe('Nome da alocação (ex: Poupança, Tesouro Direto, Ações)'),
  value: PositiveNumberSchema.describe('Valor atual da alocação'),
  startDate: DateTimeSchema.describe('Data de início da alocação'),
  contribution: z.number().min(0).optional().describe('Valor de contribuição mensal (opcional)'),
  rate: z.number().optional().describe('Taxa de retorno anual esperada (opcional)'),
  isTaxable: z.boolean().optional().describe('Indica se a alocação é tributável (padrão: false)'),
})


export const UpdateAllocationSchema = z.object({
  name: z.string().min(1).optional().describe('Novo nome da alocação'),
  value: PositiveNumberSchema.optional().describe('Novo valor atual da alocação'),
  startDate: DateTimeSchema.optional().describe('Nova data de início da alocação'),
  contribution: z.number().min(0).optional().describe('Novo valor de contribuição mensal'),
  rate: z.number().optional().describe('Nova taxa de retorno anual esperada'),
  isTaxable: z.boolean().optional().describe('Indica se a alocação é tributável'),
})

export const AllocationParamsSchema = z.object({
  id: UUIDSchema.describe('ID da alocação'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

// SCHEMAS DE RESPOSTA

// Schema base do Prisma (o que o Prisma retorna)
export const PrismaAllocationSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  name: z.string(),
  value: z.number(),
  startDate: z.date(), // Prisma retorna Date
  contribution: z.number(),
  rate: z.number(),
  isTaxable: z.boolean(),
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable(), // Prisma retorna Date ou null
})

// Schema de resposta da API (transformado para strings)
export const AllocationResponseSchema = PrismaAllocationSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  name: data.name,
  value: data.value,
  startDate: data.startDate.toISOString(), // Transforma Date para string
  contribution: data.contribution,
  rate: data.rate,
  isTaxable: data.isTaxable,
  createdAt: data.createdAt.toISOString(), // Transforma Date para string
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null, // Transforma Date para string
}))

export const AllocationListResponseSchema = z.array(AllocationResponseSchema)

// TIPOS TYPESCRIPT
export type CreateAllocation = z.infer<typeof CreateAllocationSchema>
export type UpdateAllocation = z.infer<typeof UpdateAllocationSchema>
export type AllocationResponse = z.infer<typeof AllocationResponseSchema>
