// src/infrastructure/http/routes/allocation-snapshot.routes.ts

import { FastifyInstance } from 'fastify';
import { AllocationSnapshotController } from '@/infrastructure/http/controllers/AllocationSnapshotController';

export async function allocationSnapshotRoutes(
  app: FastifyInstance,
  allocationSnapshotController: AllocationSnapshotController,
) {
  // Rotas estáticas primeiro
  app.post(
    '/allocation-snapshots',
    allocationSnapshotController.create.bind(allocationSnapshotController),
  );

  app.get(
    '/allocation-snapshots/clients/:id',
    allocationSnapshotController.listByClient.bind(allocationSnapshotController),
  );

  // Rotas dinâmicas depois
  app.get(
    '/allocation-snapshots/:id',
    allocationSnapshotController.getById.bind(allocationSnapshotController),
  );
}