import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { InsuranceController } from '../controllers/insurance.controller'
import {
  CreateInsuranceSchema,
  UpdateInsuranceSchema,
  InsuranceParamsSchema,
  ClientParamsSchema,
  InsuranceResponseSchema,
  InsuranceListResponseSchema,
  ErrorResponseSchema, // Importado do common.schema via insurance.schema
} from '../schemas/insurance.schema'

export async function insuranceRoutes(app: FastifyInstance) {
  const controller = new InsuranceController()
  const server = app.withTypeProvider<ZodTypeProvider>()

  // ============================================
  // 1️⃣ POST /insurances - CRIAR NOVO SEGURO
  // ============================================
  server.post(
    '/insurances',
    {
      schema: {
        tags: ['Insurances'],
        summary: 'Criar um novo seguro para um cliente',
        body: CreateInsuranceSchema,
        response: {
          201: InsuranceResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.create.bind(controller)
  )

  // ============================================
  // 2️⃣ GET /insurances/clients/:id - LISTAR TODOS OS SEGUROS DE UM CLIENTE
  // ============================================
  server.get(
    '/insurances/clients/:id',
    {
      schema: {
        tags: ['Insurances'],
        summary: 'Listar todos os seguros de um cliente',
        params: ClientParamsSchema,
        response: {
          200: InsuranceListResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.listByClient.bind(controller)
  )

  // ============================================
  // 3️⃣ GET /insurances/:id - BUSCAR SEGURO POR ID
  // ============================================
  server.get(
    '/insurances/:id',
    {
      schema: {
        tags: ['Insurances'],
        summary: 'Buscar um seguro por ID',
        params: InsuranceParamsSchema,
        response: {
          200: InsuranceResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.getById.bind(controller)
  )

  // ============================================
  // 4️⃣ PUT /insurances/:id - ATUALIZAR SEGURO POR ID
  // ============================================
  server.put(
    '/insurances/:id',
    {
      schema: {
        tags: ['Insurances'],
        summary: 'Atualizar um seguro existente por ID',
        params: InsuranceParamsSchema,
        body: UpdateInsuranceSchema,
        response: {
          200: InsuranceResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.update.bind(controller)
  )

  // ============================================
  // 5️⃣ DELETE /insurances/:id - DELETAR SEGURO POR ID
  // ============================================
  server.delete(
    '/insurances/:id',
    {
      schema: {
        tags: ['Insurances'],
        summary: 'Deletar um seguro por ID',
        params: InsuranceParamsSchema,
        response: {
          204: { type: 'null', description: 'Deletado com sucesso' },
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.delete.bind(controller)
  )
}
