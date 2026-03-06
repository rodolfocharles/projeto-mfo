// src/application/use-cases/helpers/clientToResponse.ts

import { Client } from '@/domain/entities/Client'
import { ClientInternalResponse } from '@/application/dtos/ClientDTO'

export function clientToResponse(c: Client): ClientInternalResponse {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    cpf: c.cpf,
    phone: c.phone ?? null,
    birthDate: c.birthDate,
    address: c.address ?? null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt ?? null,
  }
}