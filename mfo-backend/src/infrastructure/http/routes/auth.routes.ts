// src/infrastructure/http/routes/auth.routes.ts

import { FastifyInstance } from 'fastify';
import { AuthController } from '@/infrastructure/http/controllers/AuthController';

export async function authRoutes(app: FastifyInstance, authController: AuthController) {
  // rota pública de login
  app.post('/auth/login', authController.login.bind(authController));
}
