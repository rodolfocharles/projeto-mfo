// src/infrastructure/http/routes/history.routes.ts

import { FastifyInstance } from 'fastify';
import { HistoryController } from '@/infrastructure/http/controllers/HistoryController';

export async function historyRoutes(
  app: FastifyInstance,
  historyController: HistoryController,
) {
  app.get(
    '/history/clients/:id',
    historyController.listSimulationVersionsByClient.bind(historyController),
  );
}