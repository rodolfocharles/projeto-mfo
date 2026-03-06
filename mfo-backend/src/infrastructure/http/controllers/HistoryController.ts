// src/infrastructure/http/controllers/HistoryController.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { IListSimulationVersionsByClientUseCase } from '@/application/use-cases/interfaces/IHistoryUseCases';
import { ILogger } from '@/domain/services/ILogger';

export class HistoryController {
  constructor(
    private listSimulationVersionsByClientUseCase: IListSimulationVersionsByClientUseCase,
    private logger: ILogger,
  ) {}

  // GET /history/clients/:id
  async listSimulationVersionsByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };

      const response = await this.listSimulationVersionsByClientUseCase.execute({ id: clientId });

      return reply.status(200).send(response);
    } catch (error: any) {
      this.logger.error('Error listing simulation versions', error);
      return reply.status(500).send({ message: 'Failed to fetch simulation history', error: error.message });
    }
  }
}