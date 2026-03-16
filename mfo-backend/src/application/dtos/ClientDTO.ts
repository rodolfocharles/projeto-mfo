// Adicionar em src/application/dtos/ClientDTO.ts

import { z } from 'zod'
import {
  CreateClientSchema,
  UpdateClientSchema,
  PrismaClientSchema, // ← precisa existir no schema
  ClientResponseSchema,
  ClientListResponseSchema,
} from '@/schemas/client.schema'

// --- INPUTS ---
export type CreateClientInput = z.infer<typeof CreateClientSchema>
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>

// --- OUTPUTS ---
// Tipo interno (antes da transformação para string ISO)
export type ClientInternalResponse = z.infer<typeof PrismaClientSchema>

// Tipo externo (após a transformação, datas como string ISO)
export type ClientResponse = z.infer<typeof ClientResponseSchema>
export type ClientListResponse = z.infer<typeof ClientListResponseSchema>