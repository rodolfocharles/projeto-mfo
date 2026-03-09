// src/types/fastify-jwt.d.ts

import 'fastify';
import { FastifyJWTOptions, JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyJWT {
    // here you can declare the payload type that you sign and verify
    payload: { sub: string };
    user: { sub: string };
  }

  interface FastifyRequest {
    jwtVerify(): Promise<{ sub: string }>;
  }
}
