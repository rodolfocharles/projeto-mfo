// src/schemas/auth.schema.ts

import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  clientId: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
