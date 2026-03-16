// src/infrastructure/http/controllers/InsuranceController.ts

import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateInsuranceSchema, UpdateInsuranceSchema } from '@/schemas/insurance.schema'
import {
  ICreateInsuranceUseCase,
  IListClientInsurancesUseCase,
  IGetInsuranceByIdUseCase,
  IUpdateInsuranceUseCase,
  IDeleteInsuranceUseCase,
} from '@/application/use-cases/interfaces/IInsuranceUseCases'

export class InsuranceController {
  constructor(
    private createInsuranceUseCase: ICreateInsuranceUseCase,
    private listClientInsurancesUseCase: IListClientInsurancesUseCase,
    private getInsuranceByIdUseCase: IGetInsuranceByIdUseCase,
    private updateInsuranceUseCase: IUpdateInsuranceUseCase,
    private deleteInsuranceUseCase: IDeleteInsuranceUseCase,
  ) {}

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = CreateInsuranceSchema.parse(req.body)
      const response = await this.createInsuranceUseCase.execute(input)
      return reply.status(201).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to create insurance', error: error.message })
    }
  }

  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string }
      const response = await this.listClientInsurancesUseCase.execute({ clientId })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to list insurances', error: error.message })
    }
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: insuranceId } = req.params as { id: string }
      const response = await this.getInsuranceByIdUseCase.execute({ insuranceId })
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Insurance not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to fetch insurance', error: error.message })
    }
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: insuranceId } = req.params as { id: string }
      const input = UpdateInsuranceSchema.parse(req.body)
      const response = await this.updateInsuranceUseCase.execute(insuranceId, input)
      return reply.status(200).send(response)
    } catch (error: any) {
      if (error.message === 'Insurance not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to update insurance', error: error.message })
    }
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: insuranceId } = req.params as { id: string }
      await this.deleteInsuranceUseCase.execute({ insuranceId })
      return reply.status(204).send()
    } catch (error: any) {
      if (error.message === 'Insurance not found.') {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Failed to delete insurance', error: error.message })
    }
  }
}