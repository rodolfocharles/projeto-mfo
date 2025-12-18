// src/lib/schemas/simulation.schema.ts
import { z } from 'zod';

// Enum para o status de vida, se aplicável
export const LifeStatusEnum = z.enum(['NORMAL', 'RETIRED', 'DECEASED']);

// Schema para criar uma nova simulação
export const CreateSimulationFormSchema = z.object({
  name: z.string().min(1, 'O nome da simulação é obrigatório'),
  startDate: z.string().min(1, 'A data de início é obrigatória'),
  realRate: z.number().min(0, 'A taxa real deve ser positiva').max(1, 'A taxa real deve ser um valor entre 0 e 1'), // Ex: 0.05 para 5%
  inflation: z.number().min(0, 'A inflação deve ser positiva').max(1, 'A inflação deve ser um valor entre 0 e 1'), // Ex: 0.03 para 3%
  lifeStatus: LifeStatusEnum.default('NORMAL'),
});

export type CreateSimulationForm = z.infer<typeof CreateSimulationFormSchema>;

// Schema para a resposta de uma simulação do backend
export const SimulationResponseSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  name: z.string(),
  version: z.number().int().min(1),
  startDate: z.string().datetime(),
  realRate: z.number(),
  inflation: z.number(),
  lifeStatus: LifeStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  // Adicione aqui outros campos que o backend de simulation possa retornar, como 'results'
  results: z.array(z.object({
    period: z.string().datetime(),
    financial: z.number(),
    immobilized: z.number(),
    total: z.number(),
    totalNoIns: z.number(),
  })).optional(),

});

// Schema para os resultados da projeção
export const ProjectionItemSchema = z.object({
  month: z.number().int(),
  period: z.string().datetime(), // O backend retorna 'date', mas o frontend usa 'period'
  balance: z.number(),
  income: z.number(),
  expense: z.number(),
});

export type ProjectionItem = z.infer<typeof ProjectionItemSchema>;

// Schema para a resposta da rota de comparação do backend
export const CompareSimulationResponseSchema = z.object({
  simulation1: z.object({
    id: z.string().uuid(),
    name: z.string(),
    version: z.number().int(),
    realRate: z.number(),
    inflation: z.number(),
  }),
  simulation2: z.object({
    id: z.string().uuid(),
    name: z.string(),
    version: z.number().int(),
    realRate: z.number(),
    inflation: z.number(),
  }),
  comparison: z.array(z.object({
    month: z.number().int(),
    date: z.string().datetime(), // O backend retorna 'date' aqui
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

export type CompareSimulationResponse = z.infer<typeof CompareSimulationResponseSchema>;

export type SimulationResponse = z.infer<typeof SimulationResponseSchema>;

// Schema para atualizar uma simulação
export const UpdateSimulationFormSchema = CreateSimulationFormSchema.partial();
export type UpdateSimulationForm = z.infer<typeof UpdateSimulationFormSchema>;
