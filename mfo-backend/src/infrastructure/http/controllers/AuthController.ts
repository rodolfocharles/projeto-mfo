// src/infrastructure/http/controllers/AuthController.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { IAuthenticateClientUseCase } from '@/application/use-cases/interfaces/IClientUseCases';
import { LoginSchema, LoginResponseSchema } from '@/schemas/auth.schema';

export class AuthController {
  constructor(private authenticateUseCase: IAuthenticateClientUseCase) {}

  async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const input = LoginSchema.parse(req.body);
      const client = await this.authenticateUseCase.execute(
        input.email,
        input.password,
      );

      // torna a declaração "request" com jwt decorators disponível
      const token = await reply.jwtSign({ sub: client.id });

      const response = LoginResponseSchema.parse({ token, clientId: client.id });
      return reply.status(200).send(response);
    } catch (err: any) {
      // erros de validação do zod jogam ZodError, vamos tratar genericamente
      if (err?.name === 'ZodError' || err?.message === 'Invalid credentials.') {
        return reply.status(401).send({ message: 'Email ou senha inválidos.' });
      }
      return reply.status(500).send({ message: 'Erro ao autenticar.', error: err.message });
    }
  }
}
