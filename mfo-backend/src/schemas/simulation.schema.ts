// mfo-backend/src/schemas/simulation.schema.ts (ou onde estiver)
import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema'

//DEFINIR LifeStatusEnum AQUI, ou garantir que ele esteja em common.schema
export const LifeStatusEnum = z.enum(['NORMAL', 'RETIRED', 'DECEASED']);

// SCHEMAS DE REQUEST
export const CreateSimulationSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente'),
  name: z.string().min(1).describe('Nome da simulação'),
  startDate: DateTimeSchema.describe('Data de início'),
  realRate: z.number().min(0).max(1).describe('Taxa real anual (ex: 0.03 para 3%)'), 
  inflation: z.number().min(0).max(1).describe('Inflação anual (ex: 0.02 para 2%)'), 
  lifeStatus: LifeStatusEnum.describe('Status de vida'),
  version: z.number().int().min(1).optional().describe('Versão da simulação (padrão: 1)'), 
})

export const UpdateSimulationSchema = z.object({
  name: z.string().min(1).optional().describe('Novo nome'),
  startDate: DateTimeSchema.optional().describe('Nova data de início'), 
  realRate: z.number().min(0).max(1).optional().describe('Nova taxa real'), 
  inflation: z.number().min(0).max(1).optional().describe('Nova inflação'), 
  lifeStatus: LifeStatusEnum.optional().describe('Novo status'),
  version: z.number().int().min(1).optional().describe('Nova versão da simulação'), 
})

export const SimulationParamsSchema = z.object({
  id: UUIDSchema.describe('ID da simulação'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

// SCHEMAS DE RESPOSTA
// Schema base do Prisma (o que o Prisma retorna)
export const PrismaSimulationSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  name: z.string(),
  startDate: z.date(), // Prisma retorna Date
  realRate: z.number(),
  inflation: z.number(),
  lifeStatus: LifeStatusEnum,
  version: z.number().int(), 
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable(), 
})

// Resposta final transformado para strings (o que a API envia)
export const SimulationResponseSchema = PrismaSimulationSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  name: data.name,
  startDate: data.startDate.toISOString(),
  realRate: data.realRate,
  inflation: data.inflation,
  lifeStatus: data.lifeStatus,
  version: data.version, 
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null, 
}))

export const SimulationListResponseSchema = z.array(SimulationResponseSchema)

// Schema para os itens de projeção (alinha com o frontend)
export const ProjectionItemSchema = z.object({
  month: z.number().int(),
  period: DateTimeSchema, // ✅ Renomeado de 'date' para 'period' para alinhar com o frontend
  balance: z.number(),
  income: z.number(),
  expense: z.number(),
})

export const ProjectionResponseSchema = z.array(ProjectionItemSchema)

// Schema para a rota de comparação (compare)
export const CompareSimulationResponseSchema = z.object({
  simulation1: z.object({
    id: UUIDSchema,
    name: z.string(),
    version: z.number().int(),
    realRate: z.number(),
    inflation: z.number(),
  }),
  simulation2: z.object({
    id: UUIDSchema,
    name: z.string(),
    version: z.number().int(),
    realRate: z.number(),
    inflation: z.number(),
  }),
  comparison: z.array(z.object({
    month: z.number().int(),
    date: DateTimeSchema, // Aqui é 'date' no controller, então mantemos 'date'
    simulation1: z.object({
      balance: z.number(),
      income: z.number(),
      expense: z.number(),
    }),
    simulation2: z.object({
      balance: z.number(),
      income: z.number(),
      expense: z.number(),
    }),
    difference: z.object({
      balance: z.number(),
      income: z.number(),
      expense: z.number(),
    }),
  })),
});


// TIPOS TYPESCRIPT
export type CreateSimulation = z.infer<typeof CreateSimulationSchema>
export type UpdateSimulation = z.infer<typeof UpdateSimulationSchema>
export type SimulationResponse = z.infer<typeof SimulationResponseSchema>
export type ProjectionItem = z.infer<typeof ProjectionItemSchema>
export type CompareSimulationResponse = z.infer<typeof CompareSimulationResponseSchema>;

export { ErrorResponseSchema }
