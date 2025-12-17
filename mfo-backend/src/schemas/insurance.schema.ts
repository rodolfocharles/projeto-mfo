import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  NonNegativeNumberSchema,
  ErrorResponseSchema, // Importado para ser usado nas rotas
} from './common.schema'

// ENUM para Tipos de Seguro (se não estiver em common.schema)
// Se já estiver em common.schema, remova esta definição
// e certifique-se de que está importando de lá.
export const InsuranceTypeEnum = z.enum(['LIFE', 'AUTO', 'HOME', 'HEALTH', 'TRAVEL', 'OTHER']).describe('Tipos de seguro disponíveis');

// SCHEMAS DE REQUEST

// Schema para criar um novo seguro
export const CreateInsuranceSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente ao qual o seguro pertence'),
  type: InsuranceTypeEnum.describe('Tipo do seguro (ex: LIFE, AUTO, HOME)'),
  name: z.string().min(1).describe('Nome ou descrição do seguro'),
  startDate: DateTimeSchema.describe('Data de início da cobertura do seguro'),
  durationMonths: z.number().int().min(1).describe('Duração do seguro em meses'),
  monthlyPremium: PositiveNumberSchema.describe('Valor do prêmio mensal pago pelo seguro'),
  insuredAmount: PositiveNumberSchema.describe('Valor total segurado ou de cobertura'),
})

// Schema para atualizar um seguro existente (todos os campos são opcionais)
export const UpdateInsuranceSchema = z.object({
  type: InsuranceTypeEnum.optional().describe('Novo tipo do seguro'),
  name: z.string().min(1).optional().describe('Novo nome ou descrição do seguro'),
  startDate: DateTimeSchema.optional().describe('Nova data de início da cobertura'),
  durationMonths: z.number().int().min(1).optional().describe('Nova duração do seguro em meses'),
  monthlyPremium: PositiveNumberSchema.optional().describe('Novo valor do prêmio mensal'),
  insuredAmount: PositiveNumberSchema.optional().describe('Novo valor segurado'),
})

// Schemas de parâmetros para IDs
export const InsuranceParamsSchema = z.object({
  id: UUIDSchema.describe('ID do seguro'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

// SCHEMAS DE RESPOSTA

// Schema base do Prisma para Insurance (com tipos Date)
// Este schema reflete a estrutura exata do objeto retornado pelo Prisma.
export const PrismaInsuranceSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  type: z.string(),
  name: z.string(),
  startDate: z.date(), // Prisma retorna Date
  durationMonths: z.number().int(),
  monthlyPremium: z.number(),
  insuredAmount: z.number(),
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable(), // Prisma retorna Date ou null
})

// Schema de resposta da API para Insurance (transformado para strings ISO)
// Este schema é usado para serializar a resposta HTTP, convertendo Dates para strings.
export const InsuranceResponseSchema = PrismaInsuranceSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  type: data.type,
  name: data.name,
  startDate: data.startDate.toISOString(), // Converte Date para string ISO
  durationMonths: data.durationMonths,
  monthlyPremium: data.monthlyPremium,
  insuredAmount: data.insuredAmount,
  createdAt: data.createdAt.toISOString(), // Converte Date para string ISO
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null, // Converte Date para string ISO ou null
}))

// Schema para uma lista de seguros
export const InsuranceListResponseSchema = z.array(InsuranceResponseSchema)

// TIPOS TYPESCRIPT
export type CreateInsurance = z.infer<typeof CreateInsuranceSchema>
export type UpdateInsurance = z.infer<typeof UpdateInsuranceSchema>
export type InsuranceResponse = z.infer<typeof InsuranceResponseSchema>
export { ErrorResponseSchema }