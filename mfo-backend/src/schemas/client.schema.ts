// src/schemas/client.schema.ts

import { z } from 'zod';
import {
  UUIDSchema,
  DateTimeSchema,
  NonNegativeNumberSchema,
  LifeStatusEnum, // Importa o enum LifeStatus do common.schema.ts
} from './common.schema'; // Ajuste o caminho se common.schema.ts estiver em outro lugar

// --- SCHEMAS DE REQUEST (Input DTOs) ---

export const CreateClientSchema = z.object({
  name: z.string().min(1, 'Nome do cliente deve ter pelo menos 1 caractere.').describe('Nome do cliente'),
  email: z.string().email('Email inválido.').describe('Email do cliente'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').describe('Senha do cliente (será hashed)'), // Adicionado
  birthDate: DateTimeSchema.transform((str) => new Date(str)).optional().describe('Data de nascimento do cliente'), // Descomentado e transformado
  lifeStatus: LifeStatusEnum.default('NORMAL').optional().describe('Status de vida do cliente (padrão: NORMAL)'), // Descomentado
  // monthlyIncome: NonNegativeNumberSchema.optional().describe('Renda mensal'), // Se este campo existe no seu model, descomente
  // cpf: z.string().optional().describe('CPF'), // Se este campo existe no seu model, descomente
});

export const UpdateClientSchema = z.object({
  name: z.string().min(1, 'Nome do cliente deve ter pelo menos 1 caractere.').optional().describe('Novo nome'),
  email: z.string().email('Email inválido.').optional().describe('Novo email'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').optional().describe('Nova senha do cliente (será hashed)'), // Adicionado
  birthDate: DateTimeSchema.transform((str) => new Date(str)).optional().describe('Nova data de nascimento'), // Descomentado e transformado
  lifeStatus: LifeStatusEnum.optional().describe('Novo status de vida do cliente'), // Descomentado
  // monthlyIncome: NonNegativeNumberSchema.optional().describe('Nova renda mensal'), // Se este campo existe no seu model, descomente
  // cpf: z.string().optional().describe('Novo CPF'), // Se este campo existe no seu model, descomente
});

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
});

// --- SCHEMAS DE RESPOSTA (Output DTOs) ---

// Schema base do Prisma (o que o Prisma retorna ANTES da transformação para string)
// Este schema é para ser usado internamente ou para inferir o tipo que o caso de uso retorna
export const InternalClientResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  email: z.string().email(),
  password: z.string(), // O hash da senha
  birthDate: z.date().nullable(), // Prisma retorna Date ou null
  lifeStatus: LifeStatusEnum,
  // monthlyIncome: NonNegativeNumberSchema.nullable(), // Se este campo existe no seu model, descomente
  // cpf: z.string().nullable(), // Se este campo existe no seu model, descomente
  createdAt: z.date(), // Prisma retorna Date
  updatedAt: z.date().nullable(), // Prisma retorna Date ou null
});

// Resposta final transformado para a API (datas como strings ISO)
export const ClientResponseSchema = InternalClientResponseSchema.transform((data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  // Não inclua o password no DTO de resposta da API por segurança!
  birthDate: data.birthDate ? data.birthDate.toISOString() : null,
  lifeStatus: data.lifeStatus,
  // monthlyIncome: data.monthlyIncome,
  // cpf: data.cpf,
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
}));

export const CreateClientSuccessResponseSchema = z.object({
  message: z.string().describe('Mensagem de sucesso'),
  client: ClientResponseSchema.describe('Dados do cliente criado'),
});

export const ClientListResponseSchema = z.array(ClientResponseSchema);

// --- TIPOS TYPESCRIPT (para uso nos DTOs da camada de aplicação) ---
export type CreateClientRequestDTO = z.infer<typeof CreateClientSchema>;
export type UpdateClientRequestDTO = z.infer<typeof UpdateClientSchema>;
export type ClientResponseDTO = z.infer<typeof InternalClientResponseSchema>; // O DTO de resposta do caso de uso deve ser o tipo ANTES da transformação para string
// Para a lista reutilizamos o schema já criado acima, evitando a sintaxe problemática
export type ClientListResponseDTO = z.infer<typeof ClientListResponseSchema>; // Lista de DTOs internos