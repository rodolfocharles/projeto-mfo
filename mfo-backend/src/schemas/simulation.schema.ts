import { z } from 'zod'
import {
  LifeStatusEnum,
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema'

export const PrismaSimulationSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  name: z.string(),
  //email: z.string().email(),
  startDate: z.date(),
  realRate: z.number(),
  inflation: z.number(),
  lifeStatus: LifeStatusEnum,
  createdAt: z.date(),
})

//Resposta final transformado
export const SimulationResponseSchema = PrismaSimulationSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  name: data.name,
  startDate: data.startDate.toISOString(),
  realRate: data.realRate,
  inflation: data.inflation,
  lifeStatus: data.lifeStatus,
  createdAt: data.createdAt.toISOString(),
}))

// SCHEMAS DE REQUEST
export const CreateSimulationSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente'),
  name: z.string().min(1).describe('Nome da simulação'),
  startDate: DateTimeSchema.describe('Data de início'),
  realRate: z.number().describe('Taxa real anual (%)'),
  inflation: z.number().describe('Inflação anual (%)'),
  lifeStatus: LifeStatusEnum.describe('Status de vida'),
})

export const UpdateSimulationSchema = z.object({
  name: z.string().min(1).optional().describe('Novo nome'),
  realRate: z.number().optional().describe('Nova taxa real'),
  inflation: z.number().optional().describe('Nova inflação'),
  lifeStatus: LifeStatusEnum.optional().describe('Novo status'),
})

export const SimulationParamsSchema = z.object({
  id: UUIDSchema.describe('ID da simulação'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

export const SimulationListResponseSchema = z.array(SimulationResponseSchema)

export const ProjectionItemSchema = z.object({
  month: z.number(),
  date: DateTimeSchema,
  balance: z.number(),
  income: z.number(),
  expense: z.number(),
})

export const CreateSimulationSuccessResponseSchema = z.object({
  message: z.string().describe('Mensagem de sucesso'),
  client: SimulationListResponseSchema.describe('Dados da simulação criado'),
})

export const ProjectionResponseSchema = z.array(ProjectionItemSchema)

// TIPOS TYPESCRIPT
export type CreateSimulation = z.infer<typeof CreateSimulationSchema>
export type UpdateSimulation = z.infer<typeof UpdateSimulationSchema>
export type SimulationResponse = z.infer<typeof SimulationResponseSchema>
export type ProjectionItem = z.infer<typeof ProjectionItemSchema>
export { ErrorResponseSchema }

