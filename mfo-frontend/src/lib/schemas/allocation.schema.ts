import { z } from 'zod'

// Reutilize o AllocationTypeEnum do seu schema.prisma (ou defina um correspondente)
export const AllocationTypeEnum = z.enum(['FINANCIAL', 'IMMOBILIZED']);

// Replicando o AllocationResponseSchema do backend para uso no frontend
export const AllocationResponseSchema = z.object({
    id: z.string().uuid(),
    clientId: z.string().uuid(),
    name: z.string(),
    //type: z.enum(['FINANCIAL', 'IMMOBILIZED']),
    type: AllocationTypeEnum,
    value: z.number(),
    startDate: z.string().datetime(),
    contribution: z.number().optional(),
    rate: z.number().optional(),
    isTaxable: z.boolean().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
})

export const AllocationListResponseSchema = z.array(AllocationResponseSchema)
export type AllocationResponse = z.infer<typeof AllocationResponseSchema>

// Schema para criar uma alocação (para o formulário)
export const CreateAllocationFormSchema = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    type: z.enum(['FINANCIAL', 'IMMOBILIZED'], { message: 'Tipo inválido' }),
    value: z.number().min(0.01, 'O valor deve ser positivo'),
    //startDate: z.string().min(1, 'A data é obrigatória'), // String para o input de data
    date: z.string().min(1, 'A data é obrigatória'),
})

export type CreateAllocationForm = z.infer<typeof CreateAllocationFormSchema>
