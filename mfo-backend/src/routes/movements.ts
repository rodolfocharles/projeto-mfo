import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { MovementController } from '../controllers/movement.controller'
import {
  CreateMovementSchema,
  UpdateMovementSchema,
  MovementParamsSchema,
  ClientParamsSchema,
  MovementResponseSchema,
  MovementListResponseSchema,
} from '../schemas/movement.schema'
import { ErrorResponseSchema } from '../schemas/common.schema'


export async function movementRoutes(app: FastifyInstance) {
  const controller = new MovementController()

  const server = app.withTypeProvider<ZodTypeProvider>()

  //CRIAR MOVIMENTAÇÃO
  server.post('/movements',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Criar novo movimento',
        body: CreateMovementSchema,
        response: {
          201: MovementResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.create.bind(controller)
  )

  //LISTAR POR CLIENTE
  server.get(
    '/movements/clients/:id',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Listar movimentos do cliente',
        params: ClientParamsSchema,
        response: {
          200: MovementListResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.listByClient.bind(controller)
  )

  //BUSCAR POR ID
  server.get(
    '/movements/:id',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Buscar movimento por ID',
        params: MovementParamsSchema,
        response: {
          200: MovementResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.getById.bind(controller)
  )

  //ATUALIZAR MOVIMENTAÇÃO
  server.put(
    '/movements/:id',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Atualizar movimento',
        params: MovementParamsSchema,
        body: UpdateMovementSchema,
        response: {
          200: MovementResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.update.bind(controller)
  )

  //DELETAR MOVIMENTAÇÃO
  server.delete(
    '/movements/:id',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Deletar movimento',
        params: MovementParamsSchema,
        response: {
          204: { type: 'null', description: 'Deletado com sucesso' },
          404: ErrorResponseSchema,
        },
      },
    },
    controller.delete.bind(controller)
  )

  // Listar resumo de movimentação
  server.get(
    '/movements/clients/:id/summary',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Resumo de movimentos do cliente',
        params: ClientParamsSchema,
        response: {
          200: z.any(),
          404: ErrorResponseSchema,
        },
      },
    },
    controller.getSummary.bind(controller)
  )

  // LIstar Movimentação  - POR TIPO
  server.get(
    '/movements/clients/:clientId/type/:type',
    {
      schema: {
        tags: ['Movements'],
        summary: 'Listar movimentos por tipo',
        params: z.object({
          clientId: z.string().uuid(),
          type: z.string().describe('INCOME, EXPENSE ou INVESTMENT'),
        }),
        response: {
          200: MovementListResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.listByType.bind(controller)
  )


}
