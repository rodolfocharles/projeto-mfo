import { z } from 'zod'
import { ScenarioType } from '@prisma/client';

// Client
export const createClientSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
})

// Simulation
export const createSimulationSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string(),
  startDate: z.string().datetime(),
  realRate: z.number(),
  inflation: z.number(),
  lifeStatus: z.enum(['NORMAL', 'DECEASED', 'DISABLED']).default('NORMAL'),
})

export const updateSimulationSchema = z.object({
  name: z.string().optional(),
  realRate: z.number().optional(),
  inflation: z.number().optional(),
  lifeStatus: z.enum(['NORMAL', 'DECEASED', 'DISABLED']).optional(),
})

// Schemas para Query Params de Projeção
export const ProjectionQuerySchema = z.object({
  months: z.string().transform(Number).optional(), // Número de meses para projetar
  scenario: z.nativeEnum(ScenarioType).optional(), // Cenário da projeção
  eventMonth: z.string().transform(Number).optional(), // Mês de um evento específico (ex: aposentadoria)
});

// Schemas para Query Params de Comparação de Simulações
export const CompareSimulationsQuerySchema = z.object({
  id1: z.string().uuid(), // ID da primeira simulação
  id2: z.string().uuid(), // ID da segunda simulação
  months: z.string().transform(Number).optional(), // Número de meses para projetar
  scenario: z.nativeEnum(ScenarioType).optional(), // Cenário da projeção
  eventMonth: z.string().transform(Number).optional(), // Mês de um evento específico
});

// Snapshot
export const createSnapshotSchema = z.object({
  clientId: z.string().uuid(),
  date: z.string().datetime(),
  allocations: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
      type: z.enum(['FINANCIAL', 'IMMOBILIZED']),
      isFinanced: z.boolean().default(false),
      financing: z
        .object({
          downPayment: z.number(),
          installments: z.number(),
          rate: z.number(),
        })
        .optional(),
    })
  ),
})

// Movement
export const createMovementSchema = z.object({
  clientId: z.string().uuid(),
  type: z.enum(['INCOME', 'EXPENSE']),
  name: z.string(),
  value: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isRecurrent: z.boolean().default(false),
})

// Insurance
export const createInsuranceSchema = z.object({
  clientId: z.string().uuid(),
  type: z.enum(['LIFE', 'DISABILITY']),
  name: z.string(),
  startDate: z.string().datetime(),
  durationMonths: z.number(),
  monthlyPremium: z.number(),
  insuredAmount: z.number(),
})

// Params
export const idParamSchema = z.object({
  id: z.string().uuid(),
})