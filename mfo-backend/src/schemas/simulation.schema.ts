// mfo-backend/src/schemas/simulation.schema.ts

import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  PositiveNumberSchema,
  ErrorResponseSchema,
} from './common.schema' // ✅ Certifique-se que common.schema está correto e no mesmo nível

// SEU LifeStatusEnum EXISTENTE
export const LifeStatusEnum = z.enum(['NORMAL', 'RETIRED', 'DECEASED']);
// NOVO: Schema para o tipo de cenário de projeção
export const ProjectionScenarioEnum = z.enum(['VIDA', 'INVALIDEZ', 'NONE']).default('NONE').describe('Cenário de projeção para simular eventos específicos (VIDA, INVALIDEZ, NONE)');


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

// NOVO: Schema para os parâmetros de query da projeção
export const ProjectionQuerySchema = z.object({
  months: z.coerce.number().int().min(1).describe('Número de meses para a projeção'),
  scenario: ProjectionScenarioEnum.optional().describe('Cenário de evento para a projeção (VIDA, INVALIDEZ, NONE)'),
  eventMonth: z.coerce.number().int().min(0).optional().describe('Mês em que o evento ocorre (0 para o mês atual)'),
});

// NOVO: Schema para os parâmetros de query da comparação
export const CompareSimulationsQuerySchema = z.object({
  id1: UUIDSchema.describe('ID da primeira simulação'),
  id2: UUIDSchema.describe('ID da segunda simulação'),
  months: z.coerce.number().int().min(1).describe('Número de meses para a projeção'),
  scenario: ProjectionScenarioEnum.optional().describe('Cenário de evento para a projeção (VIDA, INVALIDEZ, NONE)'),
  eventMonth: z.coerce.number().int().min(0).optional().describe('Mês em que o evento ocorre (0 para o mês atual)'),
});


// SCHEMAS DE RESPOSTA
export const PrismaSimulationSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  name: z.string(),
  startDate: z.date(),
  realRate: z.number(),
  inflation: z.number(),
  lifeStatus: LifeStatusEnum,
  version: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

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

// ATUALIZADO: Schema para os itens de projeção (alinha com o que o ProjectionService retorna)
export const ProjectionItemSchema = z.object({
  simulationId: UUIDSchema,
  period: DateTimeSchema,
  financial: z.number(),
  immobilized: z.number(),
  total: z.number(),
  totalNoIns: z.number(),
  income: z.number(),
  expense: z.number(),
})

export const ProjectionResponseSchema = z.array(ProjectionItemSchema)

// ATUALIZADO: Schema para a rota de comparação (compare)
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
    period: DateTimeSchema,
    simulation1: z.object({
      total: z.number(),
      financial: z.number(),
      immobilized: z.number(),
    }),
    simulation2: z.object({
      total: z.number(),
      financial: z.number(),
      immobilized: z.number(),
    }),
    difference: z.object({
      total: z.number(),
      financial: z.number(),
      immobilized: z.number(),
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


// ✅ Adicione estes logs no final do arquivo
console.log('--- Debugging simulation.schema.ts ---');
console.log('LifeStatusEnum:', LifeStatusEnum);
console.log('ProjectionScenarioEnum:', ProjectionScenarioEnum);
console.log('ProjectionQuerySchema:', ProjectionQuerySchema);
console.log('CompareSimulationsQuerySchema:', CompareSimulationsQuerySchema);
console.log('--- End Debugging simulation.schema.ts ---');