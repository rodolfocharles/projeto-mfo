// src/infrastructure/http/controllers/HistoryController.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import {
  IListSimulationVersionsByClientUseCase,
  IGetSimulationVersionUseCase,
  IListLatestSimulationVersionsByClientUseCase,
  IListRealizedPatrimonyByClientUseCase,
} from '@/application/use-cases/interfaces/IHistoryUseCases';
import { ILogger } from '@/domain/services/ILogger';

export class HistoryController {
  constructor(
    private listSimulationVersionsByClientUseCase: IListSimulationVersionsByClientUseCase,
    private listLatestSimulationVersionsByClientUseCase: IListLatestSimulationVersionsByClientUseCase,
    private getSimulationVersionUseCase: IGetSimulationVersionUseCase,
    private listRealizedPatrimonyByClientUseCase: IListRealizedPatrimonyByClientUseCase,
    private logger: ILogger,
  ) {}

  // GET /history/clients/:id/simulations/all
  async listSimulationVersionsByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };

      const response = await this.listSimulationVersionsByClientUseCase.execute({ id: clientId });

      return reply.status(200).send(response);
    } catch (error: any) {
      this.logger.error('Error listing simulation versions', error);
      return reply
        .status(500)
        .send({ message: 'Failed to fetch simulation history', error: error.message });
    }
  }

  // GET /history/clients/:id/simulations/latest
  async listLatestSimulationVersionsByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };

      const response = await this.listLatestSimulationVersionsByClientUseCase.execute({
        id: clientId,
      });

      return reply.status(200).send(response);
    } catch (error: any) {
      this.logger.error('Error listing latest simulation versions', error);
      return reply
        .status(500)
        .send({ message: 'Failed to fetch latest simulation versions', error: error.message });
    }
  }

  // GET /history/simulations/:id
  async getSimulationVersionById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };

      const response = await this.getSimulationVersionUseCase.execute({ id });

      return reply.status(200).send(response);
    } catch (error: any) {
      if (error.message === 'Simulation version not found.') {
        return reply.status(404).send({ message: error.message });
      }

      this.logger.error('Error fetching simulation version', error);
      return reply
        .status(500)
        .send({ message: 'Failed to fetch simulation version', error: error.message });
    }
  }

  // GET /history/clients/:id/patrimony
  async listRealizedPatrimonyByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string };

      const response = await this.listRealizedPatrimonyByClientUseCase.execute({ id: clientId });

      return reply.status(200).send(response);
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message });
      }

      this.logger.error('Error listing realized patrimony history', error);
      return reply.status(500).send({
        message: 'Failed to fetch realized patrimony history',
        error: error.message,
      });
    }
  }
}