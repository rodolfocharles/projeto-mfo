// src/infrastructure/http/routes/movements.routes.ts

import { FastifyInstance } from 'fastify';
import { MovementController } from '@/infrastructure/http/controllers/MovementController';

export async function movementsRoutes(
  app: FastifyInstance,
  movementController: MovementController,
) {
  // Rotas estáticas primeiro
  app.post(
    '/movements',
    movementController.create.bind(movementController),
  );

  app.get(
    '/movements/clients/:id',
    movementController.listByClient.bind(movementController),
  );

  app.get(
    '/movements/clients/:id/summary',     // ← estático "summary" antes de ":id"
    movementController.getSummary.bind(movementController),
  );

  app.get(
    '/movements/clients/:clientId/type/:type',
    movementController.listByType.bind(movementController),
  );

  // Rotas dinâmicas depois
  app.get(
    '/movements/:id',
    movementController.getById.bind(movementController),
  );

  app.put(
    '/movements/:id',
    movementController.update.bind(movementController),
  );

  app.delete(
    '/movements/:id',
    movementController.delete.bind(movementController),
  );
}