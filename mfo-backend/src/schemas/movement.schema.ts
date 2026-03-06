// src/schemas/movement.schema.ts
import { z } from 'zod'
import {
  MovementTypeEnum,
  FrequencyEnum,
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  // IndexationEnum, ← remover daqui temporariamente, até decidir o que fazer com isso
} from './common.schema'

export const CreateMovementSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente'),
  name: z.string().min(1).describe('Nome da movimentação'),
  type: MovementTypeEnum.describe('Tipo (INCOME ou EXPENSE)'),
  value: PositiveNumberSchema.describe('Valor mensal'),
  startDate: DateTimeSchema.describe('Data de início'),
  endDate: DateTimeSchema.optional().describe('Data de término'),
  frequency: FrequencyEnum.describe('Frequência'),
  isRecurrent: z.boolean().describe('É recorrente?'),
  isIndexed: z.boolean().describe('É indexado?'),
  indexationRate: z.number().nullable().optional().describe('Taxa de indexação customizada'),
})

export const UpdateMovementSchema = z.object({
  name: z.string().min(1).optional().describe('Novo nome'),
  type: MovementTypeEnum.optional().describe('Novo tipo'),
  value: PositiveNumberSchema.optional().describe('Novo valor'),
  startDate: DateTimeSchema.optional().describe('Nova data de início'),
  endDate: DateTimeSchema.optional().describe('Nova data de término'),
  frequency: FrequencyEnum.optional().describe('Nova frequência'),
  isRecurrent: z.boolean().optional().describe('É recorrente?'),
  isIndexed: z.boolean().optional().describe('É indexado?'),
  indexationRate: z.number().nullable().optional().describe('Taxa de indexação customizada'),
})