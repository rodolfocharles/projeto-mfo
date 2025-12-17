import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AllocationController } from '../controllers/allocation.controller'
import {
  CreateAllocationSchema,
  UpdateAllocationSchema,
  AllocationParamsSchema,
  ClientParamsSchema,
  AllocationResponseSchema,
  AllocationListResponseSchema,
} from '../schemas/allocation.schema'
import { ErrorResponseSchema } from '../schemas/common.schema'

export async function allocationRoutes(app: FastifyInstance) {
  const controller = new AllocationController()
  const server = app.withTypeProvider<ZodTypeProvider>()

  //CRIAR NOVA ALOCAÇÃO
  server.post(
    '/allocations',
    {
      schema: {
        tags: ['Allocations'],
        summary: 'Criar nova alocação de patrimônio',
        body: CreateAllocationSchema,
        response: {
          201: AllocationResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.create.bind(controller)
  )

  // RESUMO DE ALOCAÇÕES POR CLIENTE
  server.get(
    '/allocations/clients/:id/summary',
    {
      schema: {
        tags: ['Allocations'],
        summary: 'Resumo de alocações do cliente',
        params: ClientParamsSchema,
        response: {
          200: z.object({
            totalAllocations: z.number().describe('Número total de alocações'),
            totalValue: z.number().describe('Valor total alocado'),
            totalContribution: z.number().describe('Soma das contribuições mensais'),
            averageRate: z.number().describe('Taxa de retorno média das alocações'),
            taxableAllocations: z.number().describe('Número de alocações tributáveis'),
            nonTaxableAllocations: z.number().describe('Número de alocações não tributáveis'),
          }),
          404: ErrorResponseSchema,
        },
      },
    },
    controller.getSummary.bind(controller)
  )

  // LISTAR TODAS AS ALOCAÇÕES DE UM CLIENTE
  server.get(
    '/allocations/clients/:id',
    {
      schema: {
        tags: ['Allocations'],
        summary: 'Listar todas as alocações de um cliente',
        params: ClientParamsSchema,
        response: {
          200: AllocationListResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.listByClient.bind(controller)
  )

  //BUSCAR ALOCAÇÃO POR ID
  server.get(
    '/allocations/:id',
    {
      schema: {
        tags: ['Allocations'],
        summary: 'Buscar alocação por ID',
        params: AllocationParamsSchema,
        response: {
          200: AllocationResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.getById.bind(controller)
  )

  // ATUALIZAR ALOCAÇÃO
  server.put(
    '/allocations/:id',
    {
      schema: {
        tags: ['Allocations'],
        summary: 'Atualizar alocação',
        params: AllocationParamsSchema,
        body: UpdateAllocationSchema,
        response: {
          200: AllocationResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.update.bind(controller)
  )

  //DELETAR ALOCAÇÃO
  server.delete(
    '/allocations/:id',
    {
      schema: {
        tags: ['Allocations'],
        summary: 'Deletar alocação',
        params: AllocationParamsSchema,
        response: {
          204: { type: 'null', description: 'Deletado com sucesso' },
          404: ErrorResponseSchema,
        },
      },
    },
    controller.delete.bind(controller)
  )
}
