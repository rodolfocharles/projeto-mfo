import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/prisma'
import { ProjectionService } from '../services/projection.service'
import { z } from 'zod'
import {
  createSimulationSchema,
  updateSimulationSchema,
  idParamSchema,
} from '../schemas'



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
      const query = req.query as { id1: string; id2: string; months?: string }

      if (!query.id1 || !query.id2) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Both id1 and id2 are required',
        })
      }

      const [simulation1, simulation2] = await Promise.all([
        prisma.simulation.findUnique({
          where: { id: query.id1 },
          include: {
            client: {
              include: {
                movements: true,
                snapshots: {  
                  orderBy: { date: 'desc' },
                  take: 1,
                  include: {
                    allocationSnapshots: true,  
                  },
                },
              },
            },
          },
        }),
        prisma.simulation.findUnique({
          where: { id: query.id2 },
          include: {
            client: {
              include: {
                movements: true,
                snapshots: {  
                  orderBy: { date: 'desc' },
                  take: 1,
                  include: {
                    allocationSnapshots: true,  
                  },
                },
              },
            },
          },
        }),
      ])

      if (!simulation1 || !simulation2) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'One or both simulations not found',
        })
      }

      const months = query.months ? parseInt(query.months) : 360
      const projection1 = this.calculateProjection(simulation1, months)
      const projection2 = this.calculateProjection(simulation2, months)

      const comparison = projection1.map((p1, index) => {
        const p2 = projection2[index]
        if (!p2) {
          // Isso pode acontecer se as projeções tiverem tamanhos diferentes
          // Você pode logar um aviso ou retornar um valor padrão/nulo
          console.warn(`Projection 2 item not found at index ${index}. Skipping comparison for this month.`);
          return null; // Retorna null para ser filtrado depois
        }
        return {
          month: p1.month,
          date: p1.period,
          simulation1: {
            balance: p1.balance,
            income: p1.income,
            expense: p1.expense,
          },
          simulation2: {
            balance: p2.balance,
            income: p2.income,
            expense: p2.expense,
          },
          difference: {
            balance: Math.round((p1.balance - p2.balance) * 100) / 100,
            income: Math.round((p1.income - p2.income) * 100) / 100,
            expense: Math.round((p1.expense - p2.expense) * 100) / 100,
          },
        }
      }).filter(Boolean); // Filtra quaisquer entradas nulas que possam ter sido retornadas

      return reply.send({
        simulation1: {
          id: simulation1.id,
          name: simulation1.name,
          version: simulation1.version,
          realRate: simulation1.realRate,
          inflation: simulation1.inflation,
        },
        simulation2: {
          id: simulation2.id,
          name: simulation2.name,
          version: simulation2.version,
          realRate: simulation2.realRate,
          inflation: simulation2.inflation,
        },
        comparison,
      })
    } catch (error) {
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
      const query = req.query as { months?: string }

      const simulation = await prisma.simulation.findUnique({
        where: { id },
        include: {
          client: {
            include: {
              movements: true,
              snapshots: {
                orderBy: { date: 'desc' },
                take: 1,
                include: {
                  allocationSnapshots: true, 
                },
              },
            },
          },
        },
      })

      if (!simulation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Simulation not found',
        })
      }

      const months = query.months ? parseInt(query.months) : 360 // Default 30 anos

      // Calcular projeção
      const projection = this.calculateProjection(simulation, months)

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

  // HELPER - Calcular projeção mês a mês
  private calculateProjection(simulation: any, months: number) {
    const projection = []
    let balance = 0

    // Pegar patrimônio inicial (última alocação)
    if (simulation.client.snapshots && simulation.client.snapshots.length > 0) {
      const lastSnapshot = simulation.client.snapshots[0]
      if (lastSnapshot.allocationSnapshots) { 
        balance = lastSnapshot.allocationSnapshots.reduce((sum: number, item: any) => {
          return sum + item.valueAtSnapshot;
        }, 0)
    }
    }

    const startDate = new Date(simulation.startDate)
    const monthlyRealRate = simulation.realRate / 100 / 12
    const monthlyInflation = simulation.inflation / 100 / 12

    for (let month = 0; month <= months; month++) {
      const currentDate = new Date(startDate)
      currentDate.setMonth(currentDate.getMonth() + month)

      // Calcular receitas e despesas do mês
      let monthlyIncome = 0
      let monthlyExpense = 0

      simulation.client.movements.forEach((movement: any) => {
        const movementStart = new Date(movement.startDate)
        const movementEnd = movement.endDate ? new Date(movement.endDate) : null

        // Verificar se movimento está ativo neste mês
        if (currentDate >= movementStart && (!movementEnd || currentDate <= movementEnd)) {
          const value = this.calculateMovementValue(movement, month, monthlyInflation)

          if (movement.type === 'INCOME') {
            monthlyIncome += value
          } else if (movement.type === 'EXPENSE') {
            monthlyExpense += value
          }
        }
      })

      // Atualizar saldo
      const netFlow = monthlyIncome - monthlyExpense
      balance = balance * (1 + monthlyRealRate) + netFlow

      projection.push({
        month,
        period: currentDate.toISOString(),
        balance: Math.round(balance * 100) / 100,
        income: Math.round(monthlyIncome * 100) / 100,
        expense: Math.round(monthlyExpense * 100) / 100,
      })
    }

    return projection
  }

  // HELPER - Calcular valor do movimento com indexação
  private calculateMovementValue(movement: any, month: number, monthlyInflation: number) {
    let value = movement.value

    if (movement.indexation === 'INFLATION') {
      value = value * Math.pow(1 + monthlyInflation, month)
    }

    // Aplicar frequência
    if (movement.frequency === 'YEARLY') {
      value = month % 12 === 0 ? value : 0
    } else if (movement.frequency === 'ONE_TIME') {
      value = month === 0 ? value : 0
    }

    return value
  }
}
