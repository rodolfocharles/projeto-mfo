import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'
import {
  ClientParamsSchema,
  SimulationParamsSchema,
} from '../schemas/history.schema'

export class HistoryController {
  // ============================================
  // 1. LISTAR TODAS AS VERSÕES DE SIMULAÇÕES DE UM CLIENTE
  // (Para a tela de "Histórico de simulações")
  // ============================================
  async listAllSimulationVersionsByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as ClientParamsSchema

      // 1. Validar se o cliente existe
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      })

      if (!client) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Client not found',
        })
      }

      // 2. Buscar todas as simulações (todas as versões) para o cliente
      const simulations = await prisma.simulation.findMany({
        where: { clientId },
        orderBy: [
          { name: 'asc' }, // Ordenar por nome da simulação
          { version: 'desc' }, // E depois por versão (mais recente primeiro)
        ],
      })

      // O FastifyTypeProviderZod usará o SimulationHistoryListResponseSchema para serializar a resposta
      return reply.send(simulations)
    } catch (error) {
      console.error('Error listing all simulation versions:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch simulation history',
      })
    }
  }

  // ============================================
  // 2. LISTAR AS VERSÕES MAIS RECENTES DE CADA SIMULAÇÃO DE UM CLIENTE
  // (Útil para a tela de "Projeção" ou visão resumida)
  // ============================================
  async listLatestSimulationVersionsByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as ClientParamsSchema

      // 1. Validar se o cliente existe
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      })

      if (!client) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Client not found',
        })
      }

      // 2. Buscar todas as simulações para o cliente, agrupando por nome
      // e selecionando a versão mais recente de cada grupo.
      // Isso é um pouco mais complexo com Prisma puro e pode exigir uma query raw
      // ou uma abordagem de duas etapas. Vamos com a abordagem de duas etapas por clareza.

      const allSimulations = await prisma.simulation.findMany({
        where: { clientId },
        orderBy: [
          { name: 'asc' },
          { version: 'desc' }, // Mais recente primeiro
        ],
      })

      const latestVersionsMap = new Map<string, typeof allSimulations[0]>()

      for (const sim of allSimulations) {
        if (!latestVersionsMap.has(sim.name)) {
          latestVersionsMap.set(sim.name, sim)
        }
      }

      const latestSimulations = Array.from(latestVersionsMap.values())

      // O FastifyTypeProviderZod usará o SimulationHistoryListResponseSchema para serializar a resposta
      return reply.send(latestSimulations)
    } catch (error) {
      console.error('Error listing latest simulation versions:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch latest simulation history',
      })
    }
  }

  // ============================================
  // 3. BUSCAR UMA VERSÃO ESPECÍFICA DE SIMULAÇÃO POR ID
  // (Para "reabrir versões" ou visualizar gráficos antigos)
  // ============================================
  async getSimulationVersionById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as SimulationParamsSchema

      const simulation = await prisma.simulation.findUnique({
        where: { id },
        // Incluir os resultados da projeção se necessário para a tela de histórico
        // include: {
        //   results: true,
        // },
      })

      if (!simulation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Simulation version not found',
        })
      }

      // O FastifyTypeProviderZod usará o SimulationHistoryResponseSchema para serializar a resposta
      return reply.send(simulation)
    } catch (error) {
      console.error('Error fetching simulation version:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch simulation version',
      })
    }
  }

  // ============================================
  // 4. LISTAR HISTÓRICO DE PATRIMÔNIO REALIZADO (ALLOCATION SNAPSHOTS) DE UM CLIENTE
  // (Para o "gráfico de realizado")
  // ============================================
  async listRealizedPatrimonyByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as ClientParamsSchema

      // 1. Validar se o cliente existe
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      })

      if (!client) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Client not found',
        })
      }

      // 2. Buscar todos os AllocationSnapshots para o cliente
      const snapshots = await prisma.snapshot.findMany({
        where: { clientId },
        include: {
          allocationSnapshots: true, // Incluir os itens de alocação dentro do snapshot
        },
        orderBy: { date: 'asc' }, // Ordenar por data para construir o histórico cronológico
      })

      // O FastifyTypeProviderZod usará o RealizedPatrimonyHistoryListResponseSchema para serializar a resposta
      return reply.send(snapshots)
    } catch (error) {
      console.error('Error listing realized patrimony history:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch realized patrimony history',
      })
    }
  }
}
