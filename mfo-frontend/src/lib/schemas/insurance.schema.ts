// src/lib/schemas/insurance.schema.ts
import { z } from 'zod';

export const InsuranceTypeEnum = z.enum(['LIFE', 'DISABILITY', 'HEALTH']); // Exemplo de tipos de seguro

export const CreateInsuranceFormSchema = z.object({
  type: InsuranceTypeEnum,
  name: z.string().min(1, 'O nome do seguro é obrigatório'),
  startDate: z.string().min(1, 'A data de início é obrigatória'),
  durationMonths: z.number().int().min(1, 'A duração em meses é obrigatória'),
  monthlyPremium: z.number().min(0, 'O prêmio mensal deve ser positivo'),
  insuredAmount: z.number().min(0, 'O valor segurado deve ser positivo'),
});

export type CreateInsuranceForm = z.infer<typeof CreateInsuranceFormSchema>;

export const InsuranceResponseSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  type: InsuranceTypeEnum,
  name: z.string(),
  startDate: z.string().datetime(),
  durationMonths: z.number().int(),
  monthlyPremium: z.number(),
  insuredAmount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
});

export type InsuranceResponse = z.infer<typeof InsuranceResponseSchema>;
