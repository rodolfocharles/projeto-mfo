import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { SimulationController } from '../controllers/simulation.controller'
import { 
  SimulationResponseSchema, 
  CreateSimulationSuccessResponseSchema,
  SimulationListResponseSchema,
  SimulationParamsSchema,
  ProjectionResponseSchema,
  CreateSimulationSchema,
  UpdateSimulationSchema,
  SimulationParamsSchema,
 } from '../schemas/simulation.schema'
import { ErrorResponseSchema, UUIDSchema } from '../schemas/common.schema'
import { z } from 'zod'

export async function simulationsRoutes(app: FastifyInstance) {
  const controller = new SimulationController()

  const server = app.withTypeProvider<ZodTypeProvider>()

   //COMPARAR (ANTES de /:id)
  server.get('/simulations/compare',
    {
      schema: {
        tags: ['Simulations'],
        summary: 'Comparar duas simulações',
        querystring: z.object({
          id1: UUIDSchema,
          id2: UUIDSchema,
          months: z.string().optional(),
        }),
        response: {
          200: z.any(),
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.compare.bind(controller)
  )

  //simulations - CRIAR SIMULAÇÃO
  server.post('/simulations',
    {
    schema: {
      tags: ['Simulations'],
      summary: 'Cria uma nova simulação para um cliente',
      body: CreateSimulationSchema,
      response: {
        201: SimulationResponseSchema,
        409: ErrorResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  },
    controller.create.bind(controller)
  )

  //LISTAR TODAS AS SIMULAÇÕES POR CLIENTE
  server.get('/simulations/clients/:id', {
    schema: {
      tags: ['Simulations'],
      summary: 'Lista todas as simulações',
      response: {
        200: SimulationListResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  }, 
  controller.listByClient.bind(controller)
  )

  //BUSCAR SIMULAÇÃO POR ID
  server.get('/simulations/:id', {
    schema: {
      tags: ['Simulations'],
      summary: 'Busca uma simulação pelo ID',
      params: SimulationParamsSchema,
      response: {
        200: SimulationResponseSchema,
        404: ErrorResponseSchema,
      },
    },
  },
  controller.getById.bind(controller)
  )

  //VER PROJEÇÃO
  server.get('/simulations/:id/projection', {
    schema: {
      tags: ['Simulations'],
      summary: 'Busca os resultados mensais da projeção para uma simulação específica.',
      params: SimulationParamsSchema,
      response: {
        200: ProjectionResponseSchema, 
        404: ErrorResponseSchema, // Se a simulação ou a projeção não for encontrada
      },
    },
  }, 
  controller.getProjection.bind(controller))

  //CRIAR VERSÃO DE SIMULAÇÂO
  server.post('/simulations/:id/versions',
    {
      schema: {
        tags: ['Simulations'],
        summary: 'Criar nova versão da simulação',
        params: SimulationParamsSchema,
        body: UpdateSimulationSchema,
        response: {
          201: SimulationResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.createVersion.bind(controller)
  )

  //ATUALIZAR SIMULAÇÃO
  server.put('/simulations/:id', {
    schema: {
      tags: ['Simulations'],
      summary: 'Atualiza uma simulação existente',
      params: SimulationParamsSchema,
      body: UpdateSimulationSchema,
      response: {
        200: SimulationResponseSchema,
        404: ErrorResponseSchema,
      },
    },
  },
  controller.update.bind(controller)
  )

  //DELETAR SIMULAÇÃO
  server.delete('/simulations/:id', {
    schema: {
      tags: ['Simulations'],
      summary: 'Deleta uma simulação pelo ID',
      params: SimulationParamsSchema,
      response: {
        204: z.null(), // Resposta sem conteúdo para sucesso de exclusão
        404: ErrorResponseSchema,
      },
    },
  }, controller.delete.bind(controller))
 
}
