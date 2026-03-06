// src/infrastructure/http/routes/simulations.routes.ts

import { FastifyInstance } from 'fastify'
import { SimulationController } from '@/infrastructure/http/controllers/SimulationController'

export async function simulationsRoutes(
  app: FastifyInstance,
  simulationController: SimulationController,
) {
  // Rotas estáticas primeiro
  app.get(
    '/simulations/compare',
    simulationController.compare.bind(simulationController),
  )

  app.post(
    '/simulations',
    simulationController.create.bind(simulationController),
  )

  app.get(
    '/simulations/clients/:id',
    simulationController.listByClient.bind(simulationController),
  )

  // Rotas dinâmicas depois
  app.get(
    '/simulations/:id/projection',
    simulationController.getProjection.bind(simulationController),
  )

  app.post(
    '/simulations/:id/versions',
    simulationController.createVersion.bind(simulationController),
  )

  app.get(
    '/simulations/:id',
    simulationController.getById.bind(simulationController),
  )

  app.put(
    '/simulations/:id',
    simulationController.update.bind(simulationController),
  )

  app.delete(
    '/simulations/:id',
    simulationController.delete.bind(simulationController),
  )
}