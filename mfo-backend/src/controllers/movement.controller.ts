import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/prisma'
import { z } from 'zod'
import { createMovementSchema, idParamSchema } from '../schemas'

type CreateMovementRequest = FastifyRequest<{
  Body: z.infer<typeof createMovementSchema>
}>

type GetByClientRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
}>

type GetMovementRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
}>

type UpdateMovementRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
  Body: Partial<z.infer<typeof createMovementSchema>>
}>

export class MovementController {

  //Criar Movimentação
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as any

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

      // Mapear frequency para isRecurrent
      const isRecurrent = body.frequency === 'MONTHLY' || body.frequency === 'YEARLY'

      const movement = await prisma.movement.create({
        data: {
          clientId: body.clientId,
          name: body.name,
          type: body.type,
          value: body.value,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : null,
          isRecurrent,
        },
      })

      return reply.status(201).send(movement)
    } catch (error) {
      console.error('Error creating movement:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create movement',
      })
    }
  }

  //LIstar Movimentação do cliente
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

      const movements = await prisma.movement.findMany({
        where: { clientId: id },
        orderBy: { startDate: 'desc' },
      })

      return reply.send(movements)
    } catch (error) {
      console.error('Error listing movements:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch movements',
      })
    }
  }

  //Buscar Movimentação por id dela
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const movement = await prisma.movement.findUnique({
        where: { id },
      })

      if (!movement) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Movement not found',
        })
      }

      return reply.send(movement)
    } catch (error) {
      console.error('Error fetching movement:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch movement',
      })
    }
  }

  //Atualizar Movimentações
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const body = req.body as any

      const existingMovement = await prisma.movement.findUnique({
        where: { id },
      })

      if (!existingMovement) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Movement not found',
        })
      }

      const updateData: any = {}

      if (body.name !== undefined) updateData.name = body.name
      if (body.type !== undefined) updateData.type = body.type
      if (body.value !== undefined) updateData.value = body.value
      if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
      if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null

      // ✅ MAPEAR frequency para isRecurrent
      if (body.frequency !== undefined) {
        updateData.isRecurrent = body.frequency === 'MONTHLY' || body.frequency === 'YEARLY'
      }

      const movement = await prisma.movement.update({
        where: { id },
        data: updateData,
      })

      return reply.send(movement)
    } catch (error) {
      console.error('Error updating movement:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update movement',
      })
    }
  }

  //Deletar Movimentação
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const movement = await prisma.movement.findUnique({
        where: { id },
      })

      if (!movement) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Movement not found',
        })
      }

      await prisma.movement.delete({
        where: { id },
      })

      return reply.status(204).send()
    } catch (error) {
      console.error('Error deleting movement:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete movement',
      })
    }
  }

  // ============================================
  // LIST BY TYPE - Filtrar por tipo
  // ============================================
  async listByType(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { clientId, type } = req.params as { clientId: string; type: string }

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

      const movements = await prisma.movement.findMany({
        where: {
          clientId,
          type: type.toUpperCase(),
        },
        orderBy: { startDate: 'desc' },
      })

      return reply.send(movements)
    } catch (error) {
      console.error('Error listing movements by type:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch movements',
      })
    }
  }

  // ============================================
  // GET SUMMARY - Resumo de movimentos
  // ============================================
  async getSummary(req: FastifyRequest, reply: FastifyReply) {
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

      const movements = await prisma.movement.findMany({
        where: { clientId: id },
      })

      const summary = {
        totalMovements: movements.length,
        income: movements
          .filter(m => m.type === 'INCOME')
          .reduce((sum, m) => sum + m.value, 0),
        expense: movements
          .filter(m => m.type === 'EXPENSE')
          .reduce((sum, m) => sum + m.value, 0),
        investment: movements
          .filter(m => m.type === 'INVESTMENT')
          .reduce((sum, m) => sum + m.value, 0),
        recurrent: movements.filter(m => m.isRecurrent).length,  
        oneTime: movements.filter(m => !m.isRecurrent).length,   
      }

      return reply.send(summary)
    } catch (error) {
      console.error('Error getting movement summary:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to get summary',
      })
    }
  }
}
