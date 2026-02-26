import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/prisma'
import { ProjectionService } from '../services/projection.service'
import { z } from 'zod'
import {
  createSimulationSchema,
  updateSimulationSchema,
  idParamSchema,
  ProjectionQuerySchema, // Importe o novo schema de query
  CompareSimulationsQuerySchema, // Importe o novo schema de query
} from '../schemas'

// ✅ Adicione estes logs logo após as importações
console.log('--- Debugging simulation.controller.ts Imports ---');
console.log('ProjectionQuerySchema (in controller):', ProjectionQuerySchema);
console.log('CompareSimulationsQuerySchema (in controller):', CompareSimulationsQuerySchema);
console.log('--- End Debugging simulation.controller.ts Imports ---');


type CreateSimulationRequest = FastifyRequest<{
  Body: z.infer<typeof createSimulationSchema>
}>
type UpdateSimulationRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
  Body: z.infer<typeof updateSimulationSchema>
}>
type GetSimulationRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
}>
type GetByClientRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
}>

const projectionService = new ProjectionService()

export class SimulationController {

  //Criar Simulação
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as any

      // Validar se cliente existe
      const client = await prisma.client.findUnique({
        where: { id: body.clientId },
      })

      if (!client) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Client not found',
        })
      }

      const simulation = await prisma.simulation.create({
        data: {
          clientId: body.clientId,
          name: body.name,
          startDate: new Date(body.startDate),
          realRate: body.realRate,
          inflation: body.inflation,
          lifeStatus: body.lifeStatus,
          version: body.version || 1,
        },
      })

      return reply.status(201).send(simulation)
    } catch (error) {
      console.error('Error creating simulation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create simulation',
      })
    }
  }

  //Listar clientes por Simulação
  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const client = await prisma.client.findUnique({
        where: { id },
      })

      if (!client) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Client not found',
        })
      }

      const simulations = await prisma.simulation.findMany({
        where: { clientId: id },
        orderBy: { createdAt: 'desc' },
      })

      return reply.send(simulations)
    } catch (error) {
      console.error('Error listing simulations:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch simulations',
      })
    }
  }
 
  //Listar Simulação por ID dela
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const simulation = await prisma.simulation.findUnique({
        where: { id },
      })
      if (!simulation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Simulation not found',
        })
      }

      return reply.send(simulation)
    } catch (error) {
      console.error('Error fetching simulation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch simulation',
      })
    }
  }

  //Atualizar Simulação
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const body = req.body as any
      const existingSimulation = await prisma.simulation.findUnique({
        where: { id },
      })

      if (!existingSimulation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Simulation not found',
        })
      }
      const updateData: any = {}
      if (body.name !== undefined) updateData.name = body.name
      if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
      if (body.realRate !== undefined) updateData.realRate = body.realRate
      if (body.inflation !== undefined) updateData.inflation = body.inflation
      if (body.lifeStatus !== undefined) updateData.lifeStatus = body.lifeStatus
      if (body.version !== undefined) updateData.version = body.version
      const simulation = await prisma.simulation.update({
        where: { id },
        data: updateData,
      })

      return reply.send(simulation)
    } catch (error) {
      console.error('Error updating simulation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update simulation',
      })
    }
  }

  //CREATE VERSION - Criar nova versão de simulação
  async createVersion(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const body = req.body as any
      console.log('Criando versão para simulação:', id)
      console.log('Body recebido:', body)

      // Buscar simulação original
      const originalSimulation = await prisma.simulation.findUnique({
        where: { id },
      })

      if (!originalSimulation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Original simulation not found',
        })
      }

      console.log('Simulação original encontrada:', originalSimulation)

      // Buscar última versão com o mesmo nome
      const lastVersion = await prisma.simulation.findFirst({
        where: {
          clientId: originalSimulation.clientId,
          name: originalSimulation.name,
        },
        orderBy: { version: 'desc' },
      })

      const nextVersion = lastVersion ? lastVersion.version + 1 : 1

      console.log('Próxima versão:', nextVersion)

      // Criar nova versão
      const newSimulation = await prisma.simulation.create({
        data: {
          clientId: originalSimulation.clientId,
          name: originalSimulation.name,
          startDate: body.startDate ? new Date(body.startDate) : originalSimulation.startDate,
          realRate: body.realRate !== undefined ? body.realRate : originalSimulation.realRate,
          inflation: body.inflation !== undefined ? body.inflation : originalSimulation.inflation,
          lifeStatus: body.lifeStatus || originalSimulation.lifeStatus,
          version: nextVersion,
        },
      })

      console.log('Nova versão criada:', newSimulation)

      return reply.status(201).send(newSimulation)
    } catch (error) {
      console.error('Error creating version:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create version',
      })
    }
  }
 
  //Deletar a Simulação
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const simulation = await prisma.simulation.findUnique({
        where: { id },
      })

      if (!simulation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Simulation not found',
        })
      }

      await prisma.simulation.delete({
        where: { id },
      })

      return reply.status(204).send()
    } catch (error) {
      console.error('Error deleting simulation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete simulation',
      })
    }
  }

  // COMPARE - Comparar duas simulações
  async compare(req: FastifyRequest, reply: FastifyReply) {
    try {
      
      // ✅ Adicione este log antes da linha que está dando erro
      console.log('CompareSimulationsQuerySchema before parse (inside compare):', CompareSimulationsQuerySchema);
     
     // ✅ Use o schema para validar e tipar a query
      const { id1, id2, months, scenario, eventMonth } = CompareSimulationsQuerySchema.parse(req.query);

      // ✅ Chame o serviço para calcular as projeções
      const projection1 = await projectionService.calculate(id1, months, scenario, eventMonth);
      const projection2 = await projectionService.calculate(id2, months, scenario, eventMonth);

      // ✅ Adapte a estrutura de comparação para o formato de retorno do seu ProjectionService
      // Seu ProjectionService retorna um array de objetos com 'period', 'financial', 'immobilized', 'total', 'totalNoIns'
      const comparison = projection1.map((p1, index) => {
        const p2 = projection2[index]
        if (!p2) {
          console.warn(`Projection 2 item not found at index ${index}. Skipping comparison for this month.`);
          return null;
        }
        return {
          month: index, // O mês pode ser o índice
          period: p1.period,
          simulation1: {
            total: p1.total,
            financial: p1.financial,
            immobilized: p1.immobilized,
            // Adicione income/expense se o ProjectionService começar a retornar
          },
          simulation2: {
            total: p2.total,
            financial: p2.financial,
            immobilized: p2.immobilized,
            // Adicione income/expense se o ProjectionService começar a retornar
          },
          difference: {
            total: Math.round((p1.total - p2.total) * 100) / 100,
            financial: Math.round((p1.financial - p2.financial) * 100) / 100,
            immobilized: Math.round((p1.immobilized - p2.immobilized) * 100) / 100,
          },
        }
      }).filter(Boolean);

      // ✅ Busque as simulações para retornar os metadados
      const [sim1Meta, sim2Meta] = await Promise.all([
        prisma.simulation.findUnique({ where: { id: id1 } }),
        prisma.simulation.findUnique({ where: { id: id2 } }),
      ]);

      return reply.send({
        simulation1: {
          id: sim1Meta?.id,
          name: sim1Meta?.name,
          version: sim1Meta?.version,
          realRate: sim1Meta?.realRate,
          inflation: sim1Meta?.inflation,
        },
        simulation2: {
          id: sim2Meta?.id,
          name: sim2Meta?.name,
          version: sim2Meta?.version,
          realRate: sim2Meta?.realRate,
          inflation: sim2Meta?.inflation,
        },
        comparison,
      })
    } catch (error) {
      console.error('Error calculating projection:', error);
      console.error('Error comparing simulations:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to compare simulations',
      })
    }
  }


  //Calculos de Projeção
  async getProjection(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      
      // ✅ Adicione este log antes da linha que está dando erro
      console.log('ProjectionQuerySchema before parse (inside getProjection):', ProjectionQuerySchema);
      // ✅ Use o schema para validar e tipar a query
      const { months, scenario, eventMonth } = ProjectionQuerySchema.parse(req.query);

      // ✅ Chame o serviço para calcular a projeção
      const projection = await projectionService.calculate(id, months, scenario, eventMonth);
      return reply.send(projection)
    } catch (error) {
      console.error('Error calculating projection:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to calculate projection',
      })
    }
  }

  // ✅ REMOVER ESTES MÉTODOS DO CONTROLLER, POIS ESTÃO NO SERVICE
  // private calculateProjection(simulation: any, months: number) { ... }
  // private calculateMovementValue(movement: any, month: number, monthlyInflation: number) { ... }
}
