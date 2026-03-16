// src/infrastructure/http/controllers/SnapshotController.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateSnapshot } from '@/application/use-cases/CreateSnapshot'
import { GetSnapshotById } from '@/application/use-cases/GetSnapshotById'
import { ListClientSnapshots } from '@/application/use-cases/ListClientSnapshots'
import { UpdateSnapshot } from '@/application/use-cases/UpdateSnapshot'
import { DeleteSnapshot } from '@/application/use-cases/DeleteSnapshot'
import { ILogger } from '@/infrastructure/services/ILogger'

const createSnapshotSchema = z.object({
  clientId: z.string().uuid(),
  date: z.string().datetime(),
  name: z.string().optional(),
  financialTotal: z.number().min(0).default(0),
  immobilizedTotal: z.number().min(0).default(0),
  totalValue: z.number().min(0).default(0),
})

const updateSnapshotSchema = z.object({
  financialTotal: z.number().min(0).optional(),
  immobilizedTotal: z.number().min(0).optional(),
  totalValue: z.number().min(0).optional(),
})

export class SnapshotController {
  constructor(
    private createSnapshotUseCase: CreateSnapshot,
    private getSnapshotByIdUseCase: GetSnapshotById,
    private listClientSnapshotsUseCase: ListClientSnapshots,
    private updateSnapshotUseCase: UpdateSnapshot,
    private deleteSnapshotUseCase: DeleteSnapshot,
    private logger: ILogger,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createSnapshotSchema.parse(request.body)
      const snapshot = await this.createSnapshotUseCase.execute(data)
      return reply.status(201).send(snapshot)
    } catch (error) {
      this.logger.error('Failed to create snapshot', error)
      return reply.status(400).send({
        message: 'Failed to create snapshot',
        error: (error as Error).message,
      })
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const snapshot = await this.getSnapshotByIdUseCase.execute({ id })
      if (!snapshot) {
        return reply.status(404).send({ message: 'Snapshot not found' })
      }
      return reply.send(snapshot)
    } catch (error) {
      this.logger.error('Failed to get snapshot', error)
      return reply.status(400).send({
        message: 'Failed to get snapshot',
        error: (error as Error).message,
      })
    }
  }

  async listByClientId(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { clientId } = request.query as { clientId: string }
      if (!clientId) {
        return reply.status(400).send({
          message: 'clientId is required',
        })
      }
      const snapshots = await this.listClientSnapshotsUseCase.execute({
        clientId,
      })
      return reply.send(snapshots)
    } catch (error) {
      this.logger.error('Failed to list snapshots', error)
      return reply.status(400).send({
        message: 'Failed to list snapshots',
        error: (error as Error).message,
      })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const data = updateSnapshotSchema.parse(request.body)
      const snapshot = await this.updateSnapshotUseCase.execute({ id, ...data })
      return reply.send(snapshot)
    } catch (error) {
      this.logger.error('Failed to update snapshot', error)
      return reply.status(400).send({
        message: 'Failed to update snapshot',
        error: (error as Error).message,
      })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      await this.deleteSnapshotUseCase.execute({ id })
      return reply.status(204).send()
    } catch (error) {
      this.logger.error('Failed to delete snapshot', error)
      return reply.status(400).send({
        message: 'Failed to delete snapshot',
        error: (error as Error).message,
      })
    }
  }
}