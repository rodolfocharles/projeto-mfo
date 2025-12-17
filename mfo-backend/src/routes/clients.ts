import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ClientController } from '../controllers/client.controller'
import {
  CreateClientSchema,
  CreateClientSuccessResponseSchema,
  UpdateClientSchema,
  ClientParamsSchema,
  ClientResponseSchema,
  ClientListResponseSchema,
} from '../schemas/client.schema'
import { ErrorResponseSchema } from '../schemas/common.schema'

export async function clientRoutes(app: FastifyInstance) {
  const controller = new ClientController()

  const server = app.withTypeProvider<ZodTypeProvider>()

  // Criar cliente
  server.post('/clients',
    {
      schema: {
        tags: ['Clients'],
        summary: 'Criar novo cliente',
        description: 'Cria um novo registro de cliente',
        body: CreateClientSchema,
        response: {
          201: CreateClientSuccessResponseSchema,
          409: ErrorResponseSchema,
          400: ErrorResponseSchema,
        },
      },
    },
    controller.create.bind(controller)
  )

  //Listar clientes
  server.get('/clients',
    {
      schema: {
        tags: ['Clients'],
        summary: 'Listar todos os clientes',
        description: 'Retorna lista de todos os clientes',
        response: {
          200: ClientListResponseSchema,
        },
      },
    }, 
    controller.list.bind(controller)
  )


  //Buscar clientes por ID
  server.get('/clients/:id',{
      schema: {
        tags: ['Clients'],
        summary: 'Buscar cliente por ID',
        description: 'Retorna os detalhes de um cliente específico',
        params: ClientParamsSchema,
        response: {
          201: CreateClientSuccessResponseSchema,
          409: ErrorResponseSchema,
          400: ErrorResponseSchema,
        },
      },
    },
    controller.getById.bind(controller)
  )

//Atualizar cliente
  server.put('/clients/:id',
    {
      schema: {
        tags: ['Clients'],
        summary: 'Atualizar cliente',
        description: 'Atualiza um ou mais campos de um cliente existente',
        params: ClientParamsSchema,
        body: UpdateClientSchema,
        response: {
          200: ClientResponseSchema,
          400: ErrorResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.update.bind(controller)
  )

  server.delete('/clients/:id',
    {
      schema: {
        tags: ['Clients'],
        summary: 'Deletar cliente',
        description: 'Remove um cliente do sistema',
        params: ClientParamsSchema,
        response: {
          204: ClientResponseSchema,
          404: ErrorResponseSchema,
        },
      },
    },
    controller.delete.bind(controller)
  )

}
