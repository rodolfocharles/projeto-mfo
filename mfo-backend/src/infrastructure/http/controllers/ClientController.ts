// src/infrastructure/http/controllers/ClientController.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import {
  ICreateClientUseCase,
  IUpdateClientUseCase,
  IGetClientByIdUseCase,
  IListClientsUseCase,
  IDeleteClientUseCase,
} from '@/application/use-cases/interfaces/IClientUseCases';
import {
  CreateClientSchema,
  UpdateClientSchema,
} from '@/schemas/client.schema';

export class ClientController {
  constructor(
    private createClientUseCase: ICreateClientUseCase,
    private updateClientUseCase: IUpdateClientUseCase,
    private getClientByIdUseCase: IGetClientByIdUseCase,
    private listClientsUseCase: IListClientsUseCase,
    private deleteClientUseCase: IDeleteClientUseCase,
  ) {}

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = CreateClientSchema.parse(req.body);
      const client = await this.createClientUseCase.execute(input);
      return reply.status(201).send({ message: 'Cliente criado com sucesso.', client });
    } catch (error: any) {
      return reply.status(400).send({ message: 'Failed to create client', error: error.message });
    }
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    try {
      const clients = await this.listClientsUseCase.execute();
      return reply.status(200).send(clients);
    } catch (error: any) {
      return reply.status(500).send({ message: 'Failed to list clients', error: error.message });
    }
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const client = await this.getClientByIdUseCase.execute(id);
      return reply.status(200).send(client);
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to fetch client', error: error.message });
    }
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const input = UpdateClientSchema.parse(req.body);
      const client = await this.updateClientUseCase.execute(id, input);
      return reply.status(200).send(client);
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message });
      }
      if (error.message === 'Email already in use.') {
        return reply.status(409).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to update client', error: error.message });
    }
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await this.deleteClientUseCase.execute(id);
      return reply.status(204).send();
    } catch (error: any) {
      if (error.message === 'Client not found.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Failed to delete client', error: error.message });
    }
  }
}