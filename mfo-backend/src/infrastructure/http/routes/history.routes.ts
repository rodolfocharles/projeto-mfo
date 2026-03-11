// src/infrastructure/http/routes/history.routes.ts

import { FastifyInstance } from 'fastify';
import { HistoryController } from '@/infrastructure/http/controllers/HistoryController';

export async function historyRoutes(
  app: FastifyInstance,
  historyController: HistoryController,
) {
  app.get(
    '/history/clients/:id/simulations/all',
    historyController.listSimulationVersionsByClient.bind(historyController),
  );

  app.get(
    '/history/simulations/:id',
    historyController.getSimulationVersionById.bind(historyController),
  );

  app.get(
    '/history/clients/:id/simulations/latest',
    historyController.listLatestSimulationVersionsByClient.bind(historyController),
  );

  app.get(
    '/history/clients/:id/patrimony',
    historyController.listRealizedPatrimonyByClient.bind(historyController),
  );
}