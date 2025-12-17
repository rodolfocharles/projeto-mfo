import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { HistoryController } from '../controllers/history.controller'
import {
  ClientParamsSchema,
  SimulationParamsSchema,
  SimulationHistoryListResponseSchema,
  SimulationHistoryResponseSchema,
  RealizedPatrimonyHistoryListResponseSchema,
  ErrorResponseSchema, // Importado do common.schema via history.schema
} from '../schemas/history.schema'

export async function historyRoutes(app: FastifyInstance) {
  const controller = new HistoryController()
  const server = app.withTypeProvider<ZodTypeProvider>()

  // ============================================
  // 1️⃣ GET /history/clients/:id/simulations/all - LISTAR TODAS AS VERSÕES DE SIMULAÇÕES DE UM CLIENTE
  // ============================================
  server.get(
    '/history/clients/:id/simulations/all',
    {
      schema: {
        tags: ['History'],
        summary: 'Listar todas as versões de simulações de um cliente',
        description: 'Retorna todas as versões de todas as simulações associadas a um cliente, ordenadas por nome e versão.',
        params: ClientParamsSchema,
        response: {
          200: SimulationHistoryListResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.listAllSimulationVersionsByClient.bind(controller)
  )

  // ============================================
  // 2️⃣ GET /history/clients/:id/simulations/latest - LISTAR AS VERSÕES MAIS RECENTES DE CADA SIMULAÇÃO DE UM CLIENTE
  // ============================================
  server.get(
    '/history/clients/:id/simulations/latest',
    {
      schema: {
        tags: ['History'],
        summary: 'Listar as versões mais recentes de cada simulação de um cliente',
        description: 'Retorna apenas a versão mais recente (maior número de versão) de cada simulação única por nome para um cliente.',
        params: ClientParamsSchema,
        response: {
          200: SimulationHistoryListResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.listLatestSimulationVersionsByClient.bind(controller)
  )

  // ============================================
  // 3️⃣ GET /history/simulations/:id - BUSCAR UMA VERSÃO ESPECÍFICA DE SIMULAÇÃO POR ID
  // ============================================
  server.get(
    '/history/simulations/:id',
    {
      schema: {
        tags: ['History'],
        summary: 'Buscar uma versão específica de simulação por ID',
        description: 'Retorna os detalhes de uma versão específica de simulação.',
        params: SimulationParamsSchema,
        response: {
          200: SimulationHistoryResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.getSimulationVersionById.bind(controller)
  )

  // ============================================
  // 4️⃣ GET /history/clients/:id/patrimony - LISTAR HISTÓRICO DE PATRIMÔNIO REALIZADO (ALLOCATION SNAPSHOTS) DE UM CLIENTE
  // ============================================
  server.get(
    '/history/clients/:id/patrimony',
    {
      schema: {
        tags: ['History'],
        summary: 'Listar histórico de patrimônio realizado de um cliente',
        description: 'Retorna todos os snapshots de alocação de um cliente, representando o histórico do patrimônio real.',
        params: ClientParamsSchema,
        response: {
          200: RealizedPatrimonyHistoryListResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.listRealizedPatrimonyByClient.bind(controller)
  )
}
