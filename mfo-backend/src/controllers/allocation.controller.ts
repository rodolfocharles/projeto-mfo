import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'

export class AllocationController {
  // CREATE - Criar nova alocação
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

      const allocation = await prisma.allocation.create({
        data: {
          clientId: body.clientId,
          name: body.name,
          type: body.type,  
          value: body.value,
          startDate: new Date(body.startDate),
          contribution: body.contribution ?? 0, // Padrão 0 se não for fornecido
          rate: body.rate ?? 0,                 // Padrão 0 se não for fornecido
          isTaxable: body.isTaxable ?? false,   // Padrão false se não for fornecido
        },
      })

      return reply.status(201).send(allocation)
    } catch (error) {
      console.error('Error creating allocation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create allocation',
      })
    }
  }

  // LIST BY CLIENT - Listar alocações de um cliente
  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    
    try {

      console.log('*** REQUISIÇÃO CHEGOU AO listByClient! ***'); // <--- ADICIONE ESTA LINHA
      console.log('Parâmetros recebidos:', req.params); // <--- E ESTA PARA VER OS PARÂMETROS

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

      const allocations = await prisma.allocation.findMany({
        where: { clientId: id },
        orderBy: { name: 'asc' },
        select: { // <--- ADICIONADO ESTE SELECT
          id: true,
          clientId: true,
          snapshotId: true,
          name: true,
          type: true, // <--- AGORA O 'type' ESTÁ INCLUÍDO EXPLICITAMENTE
          value: true,
          startDate: true,
          contribution: true,
          rate: true,
          isTaxable: true,
          isFinanced: true,
          downPayment: true,
          installments: true,
          interestRate: true,
          createdAt: true,
          updatedAt: true,
          // Certifique-se de incluir todos os outros campos que o frontend precisa
        },
      })

      return reply.send(allocations)
    } catch (error) {
      console.error('Error listing allocations:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch allocations',
      })
    }
  }

  // GET BY ID - Buscar alocação por ID
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const allocation = await prisma.allocation.findUnique({
        where: { id },
      })

      if (!allocation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Allocation not found',
        })
      }

      return reply.send(allocation)
    } catch (error) {
      console.error('Error fetching allocation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch allocation',
      })
    }
  }

  // UPDATE - Atualizar alocação
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const body = req.body as any

      const existingAllocation = await prisma.allocation.findUnique({
        where: { id },
      })

      if (!existingAllocation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Allocation not found',
        })
      }

      const updateData: any = {}

      if (body.name !== undefined) updateData.name = body.name
      if (body.value !== undefined) updateData.value = body.value
      if (body.type !== undefined) updateData.type = body.type
      if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
      if (body.contribution !== undefined) updateData.contribution = body.contribution
      if (body.rate !== undefined) updateData.rate = body.rate
      if (body.isTaxable !== undefined) updateData.isTaxable = body.isTaxable
      updateData.updatedAt = new Date() // Atualiza o timestamp de atualização

      const allocation = await prisma.allocation.update({
        where: { id },
        data: updateData,
      })

      return reply.send(allocation)
    } catch (error) {
      console.error('Error updating allocation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update allocation',
      })
    }
  }

  // DELETE - Deletar alocação
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const allocation = await prisma.allocation.findUnique({
        where: { id },
      })

      if (!allocation) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Allocation not found',
        })
      }

      await prisma.allocation.delete({
        where: { id },
      })

      return reply.status(204).send() // 204 No Content para deleção bem-sucedida
    } catch (error) {
      console.error('Error deleting allocation:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete allocation',
      })
    }
  }

  // GET SUMMARY - Resumo de alocações por cliente
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

      const allocations = await prisma.allocation.findMany({
        where: { clientId: id },
      })

      const totalValue = allocations.reduce((sum, alloc) => sum + alloc.value, 0)
      const totalContribution = allocations.reduce((sum, alloc) => sum + alloc.contribution, 0)

      const summary = {
        totalAllocations: allocations.length,
        totalValue: totalValue,
        totalContribution: totalContribution,
        averageRate: allocations.length > 0 ? allocations.reduce((sum, alloc) => sum + alloc.rate, 0) / allocations.length : 0,
        taxableAllocations: allocations.filter(alloc => alloc.isTaxable).length,
        nonTaxableAllocations: allocations.filter(alloc => !alloc.isTaxable).length,
      }

      return reply.send(summary)
    } catch (error) {
      console.error('Error getting allocation summary:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to get allocation summary',
      })
    }
  }
}
