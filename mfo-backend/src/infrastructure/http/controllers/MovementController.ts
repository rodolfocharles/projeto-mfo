// src/infrastructure/http/controllers/MovementController.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateMovementSchema, UpdateMovementSchema } from '@/schemas/movement.schema'
import {
  ICreateMovementUseCase,
  IListClientMovementsUseCase,
  IGetMovementByIdUseCase,
  IUpdateMovementUseCase,
  IDeleteMovementUseCase,
  IGetMovementSummaryUseCase,
  IListMovementsByTypeUseCase,
} from '@/application/use-cases/interfaces/IMovementUseCases'

export class MovementController {
  constructor(
    private createMovementUseCase: ICreateMovementUseCase,
    private listClientMovementsUseCase: IListClientMovementsUseCase,
    private getMovementByIdUseCase: IGetMovementByIdUseCase,
    private updateMovementUseCase: IUpdateMovementUseCase,
    private deleteMovementUseCase: IDeleteMovementUseCase,
    private getMovementSummaryUseCase: IGetMovementSummaryUseCase,
    private listMovementsByTypeUseCase: IListMovementsByTypeUseCase,
  ) {}

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = CreateMovementSchema.parse(req.body)
      const response = await this.createMovementUseCase.execute(input)
      return reply.status(201).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to create movement', error: error.message })
    }
  }

  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string }
      const response = await this.listClientMovementsUseCase.execute(clientId)
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to list movements', error: error.message })
    }
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const response = await this.getMovementByIdUseCase.execute(id)
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Movement not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to fetch movement', error: error.message })
    }
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const input = UpdateMovementSchema.parse(req.body)
      const response = await this.updateMovementUseCase.execute(id, input)
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Movement not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to update movement', error: error.message })
    }
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      await this.deleteMovementUseCase.execute(id)
      return reply.status(204).send()
    } catch (error: any) {
      if (error.message === 'Movement not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to delete movement', error: error.message })
    }
  }

  async getSummary(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string }
      const response = await this.getMovementSummaryUseCase.execute({ clientId })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to get movement summary', error: error.message })
    }
  }

  async listByType(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { clientId, type } = req.params as { clientId: string; type: string }
      const response = await this.listMovementsByTypeUseCase.execute({ clientId, type })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to list movements by type', error: error.message })
    }
  }
}