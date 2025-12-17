// ENUMS COMPARTILHADOS
import { z } from 'zod'

export const InsuranceTypeEnum = z.enum([
  'LIFE',
  'INCOME',
  'HEALTH',
  'HOME',
  'CAR',
  'OTHER',
])

export const MovementTypeEnum = z.enum([
  'INCOME',
  'EXPENSE',
  'INVESTMENT',
])

export const FrequencyEnum = z.enum([
  'MONTHLY',
  'YEARLY',
  'ONE_TIME',
])

export const IndexationEnum = z.enum([
  'IPCA',
  'NONE',
  'CUSTOM',
])

export const AllocationTypeEnum = z.enum([
  'FINANCIAL',
  'IMMOBILIZED',
])

export const LifeStatusEnum = z.enum([
  'NORMAL',
  'DISABLED',
  'DECEASED',
])

export const HistoryActionEnum = z.enum([
  'CREATED_CLIENT',
  'UPDATED_CLIENT',
  'DELETED_CLIENT',
  'CREATED_SNAPSHOT',
  'UPDATED_SNAPSHOT',
  'DELETED_SNAPSHOT',
  'CREATED_MOVEMENT',
  'UPDATED_MOVEMENT',
  'DELETED_MOVEMENT',
  'CREATED_INSURANCE',
  'UPDATED_INSURANCE',
  'DELETED_INSURANCE',
  'CREATED_SIMULATION',
  'UPDATED_SIMULATION',
  'DELETED_SIMULATION',
])

// SCHEMAS COMUNS
export const UUIDSchema = z.string().uuid()

export const DateTimeSchema = z.string().datetime()

export const PositiveNumberSchema = z.number().positive()

export const NonNegativeNumberSchema = z.number().nonnegative()

export const ErrorResponseSchema = z.object({
  statusCode: z.number().describe('Código de status HTTP do erro'),
  error: z.string().describe('Tipo de erro'),
  message: z.string().describe('Mensagem de erro detalhada'),
})

// TIPOS TYPESCRIPT (inferidos dos schemas)
export type InsuranceType = z.infer<typeof InsuranceTypeEnum>
export type MovementType = z.infer<typeof MovementTypeEnum>
export type Frequency = z.infer<typeof FrequencyEnum>
export type Indexation = z.infer<typeof IndexationEnum>
export type AllocationType = z.infer<typeof AllocationTypeEnum>
export type LifeStatus = z.infer<typeof LifeStatusEnum>
export type HistoryAction = z.infer<typeof HistoryActionEnum>
