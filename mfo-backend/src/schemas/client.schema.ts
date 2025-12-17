import { z } from 'zod'
import {
  UUIDSchema,
  DateTimeSchema,
  NonNegativeNumberSchema,
} from './common.schema'

// O Schema de Cliente que o Prisma retorna ANTES da transformação
export const PrismaClientSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  email: z.string().email(),
  // monthlyIncome: NonNegativeNumberSchema.nullable(), // Supondo que no Prisma é null
  // birthDate: z.date().nullable(),
  // cpf: z.string().nullable(),
  createdAt: z.date(),
  // updatedAt: z.date().nullable(),
})

//Resposta final transformado
export const ClientResponseSchema = PrismaClientSchema.transform((data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  // monthlyIncome: data.monthlyIncome,
  // birthDate: data.birthDate ? data.birthDate.toISOString() : null,
  // cpf: data.cpf,
  createdAt: data.createdAt.toISOString(),
  // updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
}))


// SCHEMAS DE REQUEST
export const CreateClientSchema = z.object({
  name: z.string().min(1).describe('Nome do cliente'),
  email: z.string().email().describe('Email do cliente'),
  // monthlyIncome: NonNegativeNumberSchema.optional().describe('Renda mensal'),
  // birthDate: DateTimeSchema.optional().describe('Data de nascimento'),
  // cpf: z.string().optional().describe('CPF'),
})

export const UpdateClientSchema = z.object({
  name: z.string().min(1).optional().describe('Novo nome'),
  email: z.string().email().optional().describe('Novo email'),
  monthlyIncome: NonNegativeNumberSchema.optional().describe('Nova renda mensal'),
  birthDate: DateTimeSchema.optional().describe('Nova data de nascimento'),
  cpf: z.string().optional().describe('Novo CPF'),
})

export const ClientParamsSchema = z.object({
  id: UUIDSchema.describe('ID do cliente'),
})

export const CreateClientSuccessResponseSchema = z.object({
  message: z.string().describe('Mensagem de sucesso'),
  client: ClientResponseSchema.describe('Dados do cliente criado'),
})

export const ClientListResponseSchema = z.array(ClientResponseSchema)



// TIPOS TYPESCRIPT
export type CreateClient = z.infer<typeof CreateClientSchema>
export type UpdateClient = z.infer<typeof UpdateClientSchema>
export type ClientResponse = z.infer<typeof ClientResponseSchema>
