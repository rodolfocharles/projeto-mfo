import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema'

// ✅ ENUM CORRETO (igual ao Prisma)
export const InsuranceTypeEnum = z.enum([
  'LIFE',       // Seguro de Vida
  'AUTO',       // Seguro de carro
  'HOME',       // Seguro de casa
  'HEALTH',     // Seguro de saúde
  'TRAVEL',     // Seguro de viagem
  'DISABILITY', // Seguro de Invalidez
  'OTHER',      // Outros seguros
])

// ============================================
// SCHEMAS DE REQUEST
// ============================================

export const CreateInsuranceSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente'),
  type: InsuranceTypeEnum.describe('Tipo do seguro'),
  name: z.string().min(1).describe('Nome do seguro'),
  startDate: DateTimeSchema.describe('Data de início'),

  coverage: PositiveNumberSchema.optional().describe('Valor da cobertura'),
  premium: PositiveNumberSchema.optional().describe('Valor do prêmio mensal'),
  endDate: DateTimeSchema.optional().nullable().describe('Data de término (opcional)'),

  durationMonths: z.number().int().positive().optional(),
  monthlyPremium: PositiveNumberSchema.optional(),
  insuredAmount: PositiveNumberSchema.optional(),
})

export const UpdateInsuranceSchema = z.object({
  type: InsuranceTypeEnum.optional(),
  name: z.string().min(1).optional(),
  coverage: PositiveNumberSchema.optional(),
  premium: PositiveNumberSchema.optional(),
  startDate: DateTimeSchema.optional(),
  endDate: DateTimeSchema.optional().nullable(),
})

export const InsuranceParamsSchema = z.object({
  id: z.string().uuid(),
})

export const ClientParamsSchema = z.object({
  id: z.string().uuid(),
})

// ============================================
// SCHEMAS DE RESPOSTA
// ============================================

export const PrismaInsuranceSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  type: InsuranceTypeEnum,
  name: z.string(),
  coverage: z.number(),
  premium: z.number(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const InsuranceResponseSchema = PrismaInsuranceSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  type: data.type,
  name: data.name,
  coverage: data.coverage,
  premium: data.premium,
  startDate: data.startDate.toISOString(),
  endDate: data.endDate ? data.endDate.toISOString() : null,
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt.toISOString(),
}))

export const InsuranceListResponseSchema = z.array(InsuranceResponseSchema)

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export type CreateInsurance = z.infer<typeof CreateInsuranceSchema>
export type UpdateInsurance = z.infer<typeof UpdateInsuranceSchema>
export type InsuranceResponse = z.infer<typeof InsuranceResponseSchema>

export { ErrorResponseSchema }