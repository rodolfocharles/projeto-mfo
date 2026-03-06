// src/infrastructure/http/controllers/AllocationController.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAllocationSchema, UpdateAllocationSchema } from '@/schemas/allocation.schema';
import { ICreateAllocationUseCase,
  IListClientAllocationsUseCase,
  IGetAllocationByIdUseCase,
  IUpdateAllocationUseCase,
  IDeleteAllocationUseCase,
 } from '@/application/use-cases/interfaces/IAllocationUseCases';
import { ILogger } from '@/domain/services/ILogger';

export class AllocationController {
  constructor(
    private createAllocationUseCase: ICreateAllocationUseCase,
    private listClientAllocationsUseCase: IListClientAllocationsUseCase,
    private getAllocationByIdUseCase: IGetAllocationByIdUseCase,
    private updateAllocationUseCase: IUpdateAllocationUseCase,
    private deleteAllocationUseCase: IDeleteAllocationUseCase,
    private logger: ILogger,
  ) {}

  // POST /allocations
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = CreateAllocationSchema.parse(req.body);

      const response = await this.createAllocationUseCase.execute(input);

      return reply.status(201).send(response);
    } catch (error: any) {
      this.logger.error('Error creating allocation', error);
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to create allocation', error: error.message });
    }
  }

  // GET /allocations/clients/:id
  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };

      const response = await this.listClientAllocationsUseCase.execute({ clientId });

      return reply.status(200).send(response); // ← explicitado o 200
    } catch (error: any) {
      console.error('Error listing allocations:', error);
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to fetch allocations', error: error.message });
    }
  }

  // GET /allocations/:id
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: allocationId } = req.params as { id: string };
      const response = await this.getAllocationByIdUseCase.execute({ allocationId });
      return reply.status(200).send(response);
    } catch (error: any) {
      if (error.message === 'Allocation not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to fetch allocation', error: error.message });
    }
  }

  // PUT /allocations/:id
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: allocationId } = req.params as { id: string };
      const input = UpdateAllocationSchema.parse(req.body);
      const response = await this.updateAllocationUseCase.execute(allocationId, input);
      return reply.status(200).send(response);
    } catch (error: any) {
      if (error.message === 'Allocation not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to update allocation', error: error.message });
    }
  }

  // DELETE /allocations/:id
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: allocationId } = req.params as { id: string };
      await this.deleteAllocationUseCase.execute({ allocationId });
      return reply.status(204).send();
    } catch (error: any) {
      if (error.message === 'Allocation not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to delete allocation', error: error.message });
    }
  }

  // GET /allocations/summary/:id
  async getSummary(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };
      return reply.status(501).send({ message: 'Not Implemented: Get Allocation Summary' });
    } catch (error: any) {
      return reply.status(500).send({ message: 'Failed to get allocation summary', error: error.message });
    }
  }
}