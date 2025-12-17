import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AllocationSnapshotController } from '../controllers/allocation-snapshot.controller'
import {
  CreateAllocationSnapshotSchema,
  SnapshotParamsSchema,
  ClientParamsSchema,
  FullSnapshotResponseSchema,
  FullSnapshotListResponseSchema,
  AllocationSnapshotItemParamsSchema,
  UpdateAllocationSnapshotItemSchema,
  AllocationSnapshotItemResponseSchema,
} from '../schemas/allocation-snapshot.schema'
import { ErrorResponseSchema } from '../schemas/common.schema'

export async function allocationSnapshotRoutes(app: FastifyInstance) {
  const controller = new AllocationSnapshotController()
  const server = app.withTypeProvider<ZodTypeProvider>()

  //CRIAR NOVO SNAPSHOT DE ALOCAÇÕES
  server.post(
    '/allocation-snapshots',
    {
      schema: {
        tags: ['Allocation Snapshots'],
        summary: 'Criar um novo snapshot de alocações para um cliente',
        body: CreateAllocationSnapshotSchema,
        response: {
          201: FullSnapshotResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.create.bind(controller)
  )

  //LISTAR TODOS OS SNAPSHOTS DE UM CLIENTE
  server.get(
    '/allocation-snapshots/clients/:id',
    {
      schema: {
        tags: ['Allocation Snapshots'],
        summary: 'Listar todos os snapshots de alocações de um cliente',
        params: ClientParamsSchema,
        response: {
          200: FullSnapshotListResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.listByClient.bind(controller)
  )

  //BUSCAR SNAPSHOT POR ID
  server.get(
    '/allocation-snapshots/:id',
    {
      schema: {
        tags: ['Allocation Snapshots'],
        summary: 'Buscar um snapshot de alocações por ID',
        params: SnapshotParamsSchema,
        response: {
          200: FullSnapshotResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.getById.bind(controller)
  )

  //ATUALIZAR UM ITEM DE ALOCAÇÃO DENTRO DE UM SNAPSHOT
  server.put(
    '/allocation-snapshots/items/:id',
    {
      schema: {
        tags: ['Allocation Snapshots'],
        summary: 'Atualizar um item específico dentro de um snapshot de alocações',
        params: AllocationSnapshotItemParamsSchema,
        body: UpdateAllocationSnapshotItemSchema,
        response: {
          200: AllocationSnapshotItemResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.updateAllocationSnapshotItem.bind(controller)
  )

  //DELETAR UM SNAPSHOT PRINCIPAL (E SEUS ITENS)
  server.delete(
    '/allocation-snapshots/:id',
    {
      schema: {
        tags: ['Allocation Snapshots'],
        summary: 'Deletar um snapshot de alocações principal e todos os seus itens',
        params: SnapshotParamsSchema,
        response: {
          204: { type: 'null', description: 'Deletado com sucesso' },
          404: ErrorResponseSchema,
        },
      },
    },
    controller.delete.bind(controller)
  )

  //DELETAR UM ITEM ESPECÍFICO DENTRO DE UM SNAPSHOT
  server.delete(
    '/allocation-snapshots/items/:id',
    {
      schema: {
        tags: ['Allocation Snapshots'],
        summary: 'Deletar um item específico dentro de um snapshot de alocações',
        params: AllocationSnapshotItemParamsSchema,
        response: {
          204: { type: 'null', description: 'Deletado com sucesso' },
          404: ErrorResponseSchema,
        },
      },
    },
    controller.deleteAllocationSnapshotItem.bind(controller)
  )
}
