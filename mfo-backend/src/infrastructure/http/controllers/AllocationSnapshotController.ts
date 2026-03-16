// src/infrastructure/http/controllers/AllocationSnapshotController.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAllocationSnapshotSchema } from '@/schemas/allocation-snapshot.schema';
import { ICreateAllocationSnapshotUseCase,
  IGetAllocationSnapshotByIdUseCase,
  IListClientAllocationSnapshotsUseCase,
 } from '@/application/use-cases/interfaces/IAllocationSnapshotUseCases';
import { ILogger } from '@/domain/services/ILogger';

export class AllocationSnapshotController {
  constructor(
    private createAllocationSnapshotUseCase: ICreateAllocationSnapshotUseCase,
    private getAllocationSnapshotByIdUseCase: IGetAllocationSnapshotByIdUseCase,
    private listClientAllocationSnapshotsUseCase: IListClientAllocationSnapshotsUseCase,
    private logger: ILogger,
  ) {}

  // POST /allocation-snapshots
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = CreateAllocationSnapshotSchema.parse(req.body);

      const response = await this.createAllocationSnapshotUseCase.execute(input);

      return reply.status(201).send(response);
    } catch (error: any) {
      this.logger.error('Error creating allocation snapshot', error);
      if (error.message === 'Client not found.' || error.message === 'Client has no allocations to snapshot.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to create allocation snapshot', error: error.message });
    }
  }

  // GET /allocation-snapshots/:id
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: snapshotId } = req.params as { id: string };

      const response = await this.getAllocationSnapshotByIdUseCase.execute({ snapshotId });

      return reply.status(200).send(response);
    } catch (error: any) {
      this.logger.error('Error getting allocation snapshot', error);
      if (error.message === 'Allocation snapshot not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to get allocation snapshot', error: error.message });
    }
  }

  // GET /allocation-snapshots/clients/:id
  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };

      const response = await this.listClientAllocationSnapshotsUseCase.execute({ clientId });

      return reply.status(200).send(response);
    } catch (error: any) {
      this.logger.error('Error listing allocation snapshots', error);
      return reply.status(500).send({ message: 'Failed to list allocation snapshots', error: error.message });
    }
  }
}