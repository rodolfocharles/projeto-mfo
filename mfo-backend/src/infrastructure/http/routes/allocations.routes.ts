// src/infrastructure/http/routes/allocations.routes.ts

import { FastifyInstance } from 'fastify';
import { AllocationController } from '@/infrastructure/http/controllers/AllocationController';

export async function allocationsRoutes(
  app: FastifyInstance,
  allocationController: AllocationController,
) {
  // Rotas estáticas primeiro
  app.post(
    '/allocations',
    allocationController.create.bind(allocationController),
  );

  app.get(
    '/allocations/clients/:id',       // ← estático "clients" antes de ":id"
    allocationController.listByClient.bind(allocationController),
  );

  app.get(
    '/allocations/summary/:id',       // ← estático "summary" antes de ":id"
    allocationController.getSummary.bind(allocationController),
  );

  // Rotas dinâmicas depois
  app.get(
    '/allocations/:id',
    allocationController.getById.bind(allocationController),
  );

  app.put(
    '/allocations/:id',
    allocationController.update.bind(allocationController),
  );

  app.delete(
    '/allocations/:id',
    allocationController.delete.bind(allocationController),
  );
}