// src/infrastructure/http/routes/clients.routes.ts
import { FastifyInstance } from 'fastify';
import { ClientController } from '@/infrastructure/http/controllers/ClientController';

export async function clientsRoutes(
  app: FastifyInstance,
  clientController: ClientController
) {
  app.post('/clients', clientController.create.bind(clientController));
  app.get('/clients', clientController.list.bind(clientController));
  app.get('/clients/:id', clientController.getById.bind(clientController));
  app.put('/clients/:id', clientController.update.bind(clientController));
  app.delete('/clients/:id', clientController.delete.bind(clientController));
}
