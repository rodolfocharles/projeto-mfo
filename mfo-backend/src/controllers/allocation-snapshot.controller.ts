import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'
import { CreateAllocationSnapshot, UpdateAllocationSnapshotItem } from '../schemas/allocation-snapshot.schema'

export class AllocationSnapshotController {

  //Criar um novo Snapshot de Alocações
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { clientId, date, allocations } = req.body as CreateAllocationSnapshot

      //Validar se o cliente existe
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      })

      if (!client) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Client não existe.',
        })
      }

      const clientAllocations = await prisma.allocation.findMany({
        where: {
          clientId: clientId,
        },
      });

      const totalValue = clientAllocations.reduce((sum, alloc) => sum + alloc.value, 0); // Use alloc.value do DB!

      const allocationSnapshotsData = clientAllocations.map(alloc => ({
        allocationId: alloc.id, // Use o ID da alocação atual
        valueAtSnapshot: alloc.value, // Use o valor atual da alocação
      }));

      // //Validar se todas as allocationIds fornecidas existem
      // const existingAllocationIds = await prisma.allocation.findMany({
      //   where: {
      //     id: {
      //       in: allocations.map(a => a.allocationId),
      //     },
      //     clientId: clientId, 
      //   },
      //   select: { id: true },
      // })

      // const foundIds = new Set(existingAllocationIds.map(a => a.id))
      // const missingIds = allocations.filter(a => !foundIds.has(a.allocationId))

      // if (missingIds.length > 0) {
      //   return reply.status(400).send({
      //     statusCode: 400,
      //     error: 'Bad Request',
      //     message: `Uma ou mais alocações não foram encontradas ou não pertencem ao cliente.: ${missingIds.map(m => m.allocationId).join(', ')}`,
      //   })
      // }

      // //Calcular o totalValue do Snapshot
      // const totalValue = allocations.reduce((sum, alloc) => sum + alloc.valueAtSnapshot, 0)

      //Criar o Snapshot principal
      const newSnapshot = await prisma.snapshot.create({
        data: {
          clientId,
          date: new Date(date),
          totalValue,
          allocationSnapshots: {
            createMany: {
              data: allocationSnapshotsData,
            },
          },
        },
        include: {
          allocationSnapshots: true, 
        },
      })

      // const responseData = {
      //   ...newSnapshot,
      //   allocations: newSnapshot.allocationSnapshots, // Renomear para 'allocations' para corresponder ao schema
      // }
      // delete (responseData as any).allocationSnapshots; // Remover a propriedade original
      return reply.status(201).send(newSnapshot)

    } catch (error) {
      console.error('Error creating allocation snapshot:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Fala ao Criar allocation snapshot',
      })
    }
  }

  //Listar todos os Snapshots de um cliente
  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: clientId } = req.params as { id: string }

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

      const snapshots = await prisma.snapshot.findMany({
        where: { clientId },
        include: {
          allocationSnapshots: true,
        },
        orderBy: { date: 'desc' }, // Ordenar por data mais recente
      })

      const formattedSnapshots = snapshots.map(snapshot => ({
        ...snapshot,
        allocations: snapshot.allocationSnapshots, // Renomear para 'allocations'
      }))

      return reply.send(formattedSnapshots)
    } catch (error) {
      console.error('Error listing allocation snapshots:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch allocation snapshots',
      })
    }
  }

  // GET BY ID - Buscar um Snapshot principal por ID
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const snapshot = await prisma.snapshot.findUnique({
        where: { id },
        include: {
          allocationSnapshots: true,
        },
      })

      if (!snapshot) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Snapshot not found',
        })
      }

      const formattedSnapshot = {
        ...snapshot,
        allocations: snapshot.allocationSnapshots, // Renomear para 'allocations'
      }

      return reply.send(formattedSnapshot)
    } catch (error) {
      console.error('Error fetching allocation snapshot:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch allocation snapshot',
      })
    }
  }

  //Atualizar um item específico dentro de um Snapshot
  async updateAllocationSnapshotItem(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string } // ID do AllocationSnapshotItem
      const body = req.body as UpdateAllocationSnapshotItem

      const existingItem = await prisma.allocationSnapshot.findUnique({
        where: { id },
      })

      if (!existingItem) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Allocation Snapshot Item not found',
        })
      }

      const updatedItem = await prisma.allocationSnapshot.update({
        where: { id },
        data: {
          valueAtSnapshot: body.valueAtSnapshot,
          updatedAt: new Date(),
        },
      })

      // Recalcular o totalValue do Snapshot principal se o item foi atualizado
      const parentSnapshot = await prisma.snapshot.findUnique({
        where: { id: updatedItem.snapshotId },
        include: { allocationSnapshots: true },
      })

      if (parentSnapshot) {
        const newTotalValue = parentSnapshot.allocationSnapshots.reduce((sum, item) => sum + item.valueAtSnapshot, 0)
        await prisma.snapshot.update({
          where: { id: parentSnapshot.id },
          data: { totalValue: newTotalValue, updatedAt: new Date() },
        })
      }

      return reply.send(updatedItem)
    } catch (error) {
      console.error('Error updating allocation snapshot item:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update allocation snapshot item',
      })
    }
  }

  // DELETE - Deletar um Snapshot principal (e seus itens)
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const snapshot = await prisma.snapshot.findUnique({
        where: { id },
      })

      if (!snapshot) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Snapshot not found',
        })
      }

      // Prisma onDelete: Cascade deve cuidar dos AllocationSnapshots,
      // mas podemos deletar explicitamente para clareza ou se a relação não for CASCADE
      await prisma.allocationSnapshot.deleteMany({
        where: { snapshotId: id },
      })

      await prisma.snapshot.delete({
        where: { id },
      })

      return reply.status(204).send() // 204 No Content para deleção bem-sucedida
    } catch (error) {
      console.error('Error deleting allocation snapshot:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete allocation snapshot',
      })
    }
  }

  // DELETE ALLOCATION SNAPSHOT ITEM - Deletar um item específico dentro de um Snapshot
  async deleteAllocationSnapshotItem(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string } // ID do AllocationSnapshotItem

      const existingItem = await prisma.allocationSnapshot.findUnique({
        where: { id },
      })

      if (!existingItem) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Allocation Snapshot Item not found',
        })
      }

      await prisma.allocationSnapshot.delete({
        where: { id },
      })

      // Recalcular o totalValue do Snapshot principal após a remoção do item
      const parentSnapshot = await prisma.snapshot.findUnique({
        where: { id: existingItem.snapshotId },
        include: { allocationSnapshots: true },
      })

      if (parentSnapshot) {
        const newTotalValue = parentSnapshot.allocationSnapshots.reduce((sum, item) => sum + item.valueAtSnapshot, 0)
        await prisma.snapshot.update({
          where: { id: parentSnapshot.id },
          data: { totalValue: newTotalValue, updatedAt: new Date() },
        })
      }

      return reply.status(204).send()
    } catch (error) {
      console.error('Error deleting allocation snapshot item:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete allocation snapshot item',
      })
    }
  }
}
