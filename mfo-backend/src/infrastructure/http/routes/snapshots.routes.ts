// src/infrastructure/http/routes/snapshots.routes.ts

import { FastifyInstance } from 'fastify'
import { SnapshotController } from '@/infrastructure/http/controllers/SnapshotController'

export async function snapshotsRoutes(
  fastifyInstance: FastifyInstance,
  snapshotController: SnapshotController,
) {
  fastifyInstance.post<{ Body: any }>(
    '/snapshots',
    async (request, reply) => {
      return snapshotController.create(request, reply)
    },
  )

  fastifyInstance.get<{ Params: { id: string } }>(
    '/snapshots/:id',
    async (request, reply) => {
      return snapshotController.getById(request, reply)
    },
  )

  fastifyInstance.get<{ Querystring: { clientId: string } }>(
    '/snapshots',
    async (request, reply) => {
      return snapshotController.listByClientId(request, reply)
    },
  )

  fastifyInstance.put<{ Params: { id: string }; Body: any }>(
    '/snapshots/:id',
    async (request, reply) => {
      return snapshotController.update(request, reply)
    },
  )

  fastifyInstance.delete<{ Params: { id: string } }>(
    '/snapshots/:id',
    async (request, reply) => {
      return snapshotController.delete(request, reply)
    },
  )
}