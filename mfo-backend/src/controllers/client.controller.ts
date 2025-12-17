import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/prisma'
import { z } from 'zod'
import { createClientSchema, idParamSchema } from '../schemas'

type CreateClientRequest = FastifyRequest<{
  Body: z.infer<typeof createClientSchema>
}>

type GetClientRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
}>

type UpdateClientRequest = FastifyRequest<{
  Params: z.infer<typeof idParamSchema>
  Body: Partial<z.infer<typeof createClientSchema>>
}>

export class ClientController {
  //Criar os clientes
  async create(req: CreateClientRequest, reply: FastifyReply) {
    try {
      const { email } = req.body
      //Verifica se o email já existe
      const existingClient = await prisma.client.findUnique({
        where: { email },
      })

      if (existingClient) {
        return reply.status(409).send({
          statusCode: 409,
          error: "Conflit",
          message: "O email digitado já está cadastrado.",
        })
      }
      //Se não tiver cadastrado, segue a criação do cadastro do cliente
      const client = await prisma.client.create({
        data: req.body,
      })
      return reply.status(201).send({
        message: 'Cliente cadastrado com sucesso!',
        client: client,
      })
      
    } catch (error) {

      console.error('Erro na criação do cliente:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Erro interno ao processar a criação do cliente.',
      })
      
    }

  }


  //Listar os clientes
  async list(req: FastifyRequest, reply: FastifyReply) {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return reply.send(clients)
  }


  //Buscar os clientes
  async getById(req: GetClientRequest, reply: FastifyReply) {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
    })

    if (!client) {
      return reply.status(404).send({ error: 'Cliente não encontrado.' })
    }

    return reply.send(client)
  }
  //Atualizar os clientes
  async update(req: UpdateClientRequest, reply: FastifyReply) {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body,
    })

    //return reply.send(client)
    return reply.status(201).send({
        message: 'Cliente atualizado com sucesso!',
        client: client,
    })
  }

  async delete(req: GetClientRequest, reply: FastifyReply) {
    await prisma.client.delete({
      where: { id: req.params.id },
    })

    //return reply.status(204).send()
    return reply.status(204).send('Cliente Deletado!')
  }
}
