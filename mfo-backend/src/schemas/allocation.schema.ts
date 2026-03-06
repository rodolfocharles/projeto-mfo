// src/schemas/allocation.schema.ts

import { z } from 'zod';
import {
  UUIDSchema,
  DateTimeSchema, // Importado, mas será transformado
  NonNegativeNumberSchema, // Usado para valores que podem ser zero
  AllocationTypeEnum, // Usando o enum do common.schema.ts
} from './common.schema'; // Ajuste o caminho se common.schema.ts estiver em outro lugar

// --- SCHEMAS DE REQUEST (Input DTOs) ---

export const CreateAllocationSchema = z.object({
  clientId: UUIDSchema.describe('ID do cliente ao qual a alocação pertence'),
  name: z.string().min(1, 'Nome da alocação deve ter pelo menos 1 caractere.').describe('Nome da alocação (ex: Poupança, Tesouro Direto, Ações)'),
  type: AllocationTypeEnum.describe('Tipo da alocação (FINANCIAL, IMMOBILIZED)'),
  value: NonNegativeNumberSchema.describe('Valor atual da alocação'), // Pode ser 0
  //startDate: DateTimeSchema.transform((str) => new Date(str)).describe('Data de início da alocação'), // Transforma para Date
  startDate: z.coerce.date().describe('Data de início da alocação'), 
  contribution: NonNegativeNumberSchema.default(0).describe('Valor de contribuição mensal (opcional)'), // Pode ser 0
  rate: NonNegativeNumberSchema.default(0).describe('Taxa de retorno anual esperada (opcional)'), // Pode ser 0
  isTaxable: z.boolean().default(false).describe('Indica se a alocação é tributável (padrão: false)'),

  // Campos de financiamento
  isFinanced: z.boolean().default(false).describe('Indica se a alocação é financiada (padrão: false)'),
  downPayment: NonNegativeNumberSchema.nullable().optional().describe('Valor da entrada do financiamento (obrigatório se isFinanced for true)'),
  installments: z.number().int().positive('Parcelas devem ser um número inteiro positivo.').nullable().optional().describe('Número de parcelas do financiamento (obrigatório se isFinanced for true)'),
  interestRate: NonNegativeNumberSchema.nullable().optional().describe('Taxa de juros anual do financiamento (obrigatório se isFinanced for true)'), // Pode ser 0
}).refine(data => {
  // Validação condicional para campos de financiamento
  if (data.isFinanced) {
    return (data.downPayment !== undefined && data.downPayment !== null) &&
           (data.installments !== undefined && data.installments !== null) &&
           (data.interestRate !== undefined && data.interestRate !== null);
  }
  return true;
}, {
  message: 'Campos de financiamento (entrada, parcelas, taxa de juros) são obrigatórios se a alocação for financiada.',
  path: ['isFinanced'],
});


export const UpdateAllocationSchema = z.object({
  name: z.string().min(1, 'Nome da alocação deve ter pelo menos 1 caractere.').optional().describe('Novo nome da alocação'),
  type: AllocationTypeEnum.optional().describe('Novo tipo da alocação (FINANCIAL, IMMOBILIZED)'),
  value: NonNegativeNumberSchema.optional().describe('Novo valor atual da alocação'),
  //startDate: DateTimeSchema.transform((str) => new Date(str)).optional().describe('Nova data de início da alocação'), // Transforma para Date
  startDate: z.coerce.date().optional().describe('Nova data de início'),
  contribution: NonNegativeNumberSchema.optional().describe('Nova contribuição não pode ser negativa.'),
  rate: NonNegativeNumberSchema.optional().describe('Nova taxa não pode ser negativa.'),
  isTaxable: z.boolean().optional().describe('Indica se a alocação é tributável'),

  // Campos de financiamento para atualização
  isFinanced: z.boolean().optional().describe('Indica se a alocação é financiada'),
  downPayment: NonNegativeNumberSchema.nullable().optional().describe('Valor da entrada do financiamento'),
  installments: z.number().int().positive('Parcelas devem ser um número inteiro positivo.').nullable().optional().describe('Número de parcelas do financiamento'),
  interestRate: NonNegativeNumberSchema.nullable().optional().describe('Taxa de juros anual do financiamento'),
}).refine(data => {
  // Validação condicional para campos de financiamento na atualização
  if (data.isFinanced === true) { // Se isFinanced for explicitamente true
    return (data.downPayment !== undefined && data.downPayment !== null) &&
           (data.installments !== undefined && data.installments !== null) &&
           (data.interestRate !== undefined && data.interestRate !== null);
  }
  return true;
}, {
  message: 'Campos de financiamento (entrada, parcelas, taxa de juros) são obrigatórios se a alocação for marcada como financiada.',
  path: ['isFinanced'],
});


export const AllocationParamsSchema = z.object({
  id: UUIDSchema.describe('ID da alocação'),
});

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
});

// --- SCHEMAS DE RESPOSTA (Output DTOs) ---

// Schema base do Prisma (o que o Prisma retorna ANTES da transformação para string)
// Este schema é para ser usado internamente ou para inferir o tipo que o caso de uso retorna
export const InternalAllocationResponseSchema = z.object({
  id: UUIDSchema,
  clientId: UUIDSchema,
  snapshotId: UUIDSchema.nullable(), // Pode ser nulo
  name: z.string(),
  type: AllocationTypeEnum,
  value: z.number(),
  startDate: z.date(), // Prisma retorna Date
  contribution: z.number(),
  rate: z.number(),
  isTaxable: z.boolean(),
  isFinanced: z.boolean(),
  downPayment: z.number().nullable(),
  installments: z.number().nullable(),
  interestRate: z.number().nullable(),
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable(), // Prisma retorna Date ou null
});

// Schema de resposta da API (transformado para strings para JSON)
export const AllocationResponseSchema = InternalAllocationResponseSchema.transform((data) => ({
  id: data.id,
  clientId: data.clientId,
  snapshotId: data.snapshotId,
  name: data.name,
  type: data.type,
  value: data.value,
  startDate: data.startDate.toISOString(), // Transforma Date para string
  contribution: data.contribution,
  rate: data.rate,
  isTaxable: data.isTaxable,
  isFinanced: data.isFinanced,
  downPayment: data.downPayment,
  installments: data.installments,
  interestRate: data.interestRate,
  createdAt: data.createdAt.toISOString(), // Transforma Date para string
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null, // Transforma Date para string
}));

export const AllocationListResponseSchema = z.array(AllocationResponseSchema);

// --- TIPOS TYPESCRIPT (para uso nos DTOs da camada de aplicação) ---
export type CreateAllocationRequestDTO = z.infer<typeof CreateAllocationSchema>;
export type UpdateAllocationRequestDTO = z.infer<typeof UpdateAllocationSchema>;
export type AllocationResponseDTO = z.infer<typeof InternalAllocationResponseSchema>; // O DTO de resposta do caso de uso deve ser o tipo ANTES da transformação para string
export type AllocationListResponseDTO = AllocationResponseDTO[]; // Lista de DTOs internos