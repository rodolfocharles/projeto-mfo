// src/infrastructure/http/controllers/SimulationController.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateSimulationSchema, UpdateSimulationSchema } from '@/schemas/simulation.schema'
import {
  ICreateSimulationUseCase,
  IListClientSimulationsUseCase,
  IGetSimulationByIdUseCase,
  IUpdateSimulationUseCase,
  IDeleteSimulationUseCase,
  ICreateSimulationVersionUseCase,
  IGetProjectionUseCase,
  ICompareSimulationsUseCase,
} from '@/application/use-cases/interfaces/ISimulationUseCases'

export class SimulationController {
  constructor(
    private createSimulationUseCase: ICreateSimulationUseCase,
    private listClientSimulationsUseCase: IListClientSimulationsUseCase,
    private getSimulationByIdUseCase: IGetSimulationByIdUseCase,
    private updateSimulationUseCase: IUpdateSimulationUseCase,
    private deleteSimulationUseCase: IDeleteSimulationUseCase,
    private createSimulationVersionUseCase: ICreateSimulationVersionUseCase,
    private getProjectionUseCase: IGetProjectionUseCase,
    private compareSimulationsUseCase: ICompareSimulationsUseCase,
  ) {}

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = CreateSimulationSchema.parse(req.body)
      const response = await this.createSimulationUseCase.execute(input)
      return reply.status(201).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to create simulation', error: error.message })
    }
  }

  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string }
      const response = await this.listClientSimulationsUseCase.execute({ clientId })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to list simulations', error: error.message })
    }
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: simulationId } = req.params as { id: string }
      const response = await this.getSimulationByIdUseCase.execute({ simulationId })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Simulation not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to fetch simulation', error: error.message })
    }
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: simulationId } = req.params as { id: string }
      const input = UpdateSimulationSchema.parse(req.body)
      const response = await this.updateSimulationUseCase.execute(simulationId, input)
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Simulation not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to update simulation', error: error.message })
    }
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: simulationId } = req.params as { id: string }
      await this.deleteSimulationUseCase.execute({ simulationId })
      return reply.status(204).send()
    } catch (error: any) {
      if (error.message === 'Simulation not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to delete simulation', error: error.message })
    }
  }

  async createVersion(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: simulationId } = req.params as { id: string }
      const input = UpdateSimulationSchema.parse(req.body)
      const response = await this.createSimulationVersionUseCase.execute({
        simulationId,
        updateData: input,
      })
      return reply.status(201).send(response)
    } catch (error: any) {
      if (error.message === 'Simulation not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to create simulation version', error: error.message })
    }
  }

  async getProjection(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: simulationId } = req.params as { id: string }
      const { months, scenario, eventMonth } = req.query as {
        months: string
        scenario?: string
        eventMonth?: string
      }

      const response = await this.getProjectionUseCase.execute({
        simulationId,
        months: parseInt(months),
        scenario,
        eventMonth: eventMonth ? parseInt(eventMonth) : undefined,
      })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Simulation not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to get projection', error: error.message })
    }
  }

  async compare(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id1, id2, months, scenario, eventMonth } = req.query as {
        id1: string
        id2: string
        months: string
        scenario?: string
        eventMonth?: string
      }

      const response = await this.compareSimulationsUseCase.execute({
        id1,
        id2,
        months: parseInt(months),
        scenario,
        eventMonth: eventMonth ? parseInt(eventMonth) : undefined,
      })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to compare simulations', error: error.message })
    }
  }
}