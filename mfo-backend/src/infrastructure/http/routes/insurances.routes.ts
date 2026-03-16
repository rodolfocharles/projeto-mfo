// src/infrastructure/http/routes/insurances.routes.ts

import { FastifyInstance } from 'fastify'
import { InsuranceController } from '@/infrastructure/http/controllers/InsuranceController'

export async function insurancesRoutes(
  app: FastifyInstance,
  insuranceController: InsuranceController,
) {
  // Rotas estáticas primeiro
  app.post(
    '/insurances',
    insuranceController.create.bind(insuranceController),
  )

  app.get(
    '/insurances/clients/:id',
    insuranceController.listByClient.bind(insuranceController),
  )

  // Rotas dinâmicas depois
  app.get(
    '/insurances/:id',
    insuranceController.getById.bind(insuranceController),
  )

  app.put(
    '/insurances/:id',
    insuranceController.update.bind(insuranceController),
  )

  app.delete(
    '/insurances/:id',
    insuranceController.delete.bind(insuranceController),
  )
}