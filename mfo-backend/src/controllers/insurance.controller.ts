import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'
import {
  CreateInsuranceSchema,
  UpdateInsuranceSchema,
  InsuranceParamsSchema,
  ClientParamsSchema,
} from '../schemas/insurance.schema' // Importar os schemas de request

export class InsuranceController {
  // ============================================
  // CREATE - Criar um novo Seguro
  // ============================================
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as any

      // Validar se o cliente existe
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

      // ✅ Preparar dados base
      const data: any = {
        clientId: body.clientId,
        type: body.type,
        name: body.name,
        startDate: new Date(body.startDate),
      }

      // ✅ DETECTAR FORMATO E PREENCHER CAMPOS OBRIGATÓRIOS

      // Se veio formato NOVO (coverage + premium)
      if (body.coverage !== undefined && body.premium !== undefined) {
        data.coverage = body.coverage
        data.premium = body.premium
        if (body.endDate !== undefined) {
          data.endDate = body.endDate ? new Date(body.endDate) : null
        }
        // Preencher campos antigos também (para compatibilidade)
        data.monthlyPremium = body.premium
        data.insuredAmount = body.coverage
      }

      // Se veio formato ANTIGO (durationMonths + monthlyPremium + insuredAmount)
      else if (body.durationMonths !== undefined && 
              body.monthlyPremium !== undefined && 
              body.insuredAmount !== undefined) {

        data.durationMonths = body.durationMonths
        data.monthlyPremium = body.monthlyPremium
        data.insuredAmount = body.insuredAmount

        // ✅ PREENCHER CAMPOS OBRIGATÓRIOS (coverage e premium)
        data.coverage = body.insuredAmount
        data.premium = body.monthlyPremium

        // Calcular endDate baseado em durationMonths
        const endDate = new Date(body.startDate)
        endDate.setMonth(endDate.getMonth() + body.durationMonths)
        data.endDate = endDate
      }

      // Se não veio nenhum formato válido
      else {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Deve fornecer (coverage + premium) OU (durationMonths + monthlyPremium + insuredAmount)',
        })
      }

      // Criar o seguro
      const newInsurance = await prisma.insurance.create({ data })

      return reply.status(201).send(newInsurance)
    } catch (error) {
      console.error('Error creating insurance:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to create insurance',
      })
    }
  }
  // ============================================
  // LIST BY CLIENT - Listar todos os Seguros de um cliente
  // ============================================
  async listByClient(req: FastifyRequest, reply: FastifyReply) {
    try {
      // O ID do cliente já é validado pelo ZodTypeProvider e tipado pelo schema da rota
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

      // 2. Buscar todos os seguros do cliente
      const insurances = await prisma.insurance.findMany({
        where: { clientId },
        orderBy: { startDate: 'desc' }, // Ordenar por data de início mais recente
      })

      // O FastifyTypeProviderZod usará o InsuranceListResponseSchema para serializar a resposta
      return reply.send(insurances)
    } catch (error) {
      console.error('Error listing insurances:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch insurances',
      })
    }
  }

  // ============================================
  // GET BY ID - Buscar um Seguro por ID
  // ============================================
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      // O ID do seguro já é validado pelo ZodTypeProvider e tipado pelo schema da rota
      const { id } = req.params as InsuranceParamsSchema

      // 1. Buscar o seguro pelo ID
      const insurance = await prisma.insurance.findUnique({
        where: { id },
      })

      if (!insurance) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Insurance not found',
        })
      }

      // O FastifyTypeProviderZod usará o InsuranceResponseSchema para serializar a resposta
      return reply.send(insurance)
    } catch (error) {
      console.error('Error fetching insurance:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to fetch insurance',
      })
    }
  }

  // ============================================
  // UPDATE - Atualizar um Seguro por ID
  // ============================================
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      // O ID do seguro e o body já são validados e tipados pelos schemas da rota
      const { id } = req.params as InsuranceParamsSchema
      const body = req.body as UpdateInsuranceSchema

      // 1. Verificar se o seguro existe
      const existingInsurance = await prisma.insurance.findUnique({
        where: { id },
      })

      if (!existingInsurance) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Insurance not found',
        })
      }

      // 2. Preparar dados para atualização (apenas campos enviados e converter startDate se presente)
      const updateData: Partial<typeof existingInsurance> = {}
      if (body.type !== undefined) updateData.type = body.type
      if (body.name !== undefined) updateData.name = body.name
      if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate) // Converter string ISO para Date
      if (body.durationMonths !== undefined) updateData.durationMonths = body.durationMonths
      if (body.monthlyPremium !== undefined) updateData.monthlyPremium = body.monthlyPremium
      if (body.insuredAmount !== undefined) updateData.insuredAmount = body.insuredAmount

      // 3. Atualizar o seguro no Prisma
      const updatedInsurance = await prisma.insurance.update({
        where: { id },
        data: updateData,
      })

      // O FastifyTypeProviderZod usará o InsuranceResponseSchema para serializar a resposta
      return reply.send(updatedInsurance)
    } catch (error) {
      console.error('Error updating insurance:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update insurance',
      })
    }
  }

  // ============================================
  // DELETE - Deletar um Seguro por ID
  // ============================================
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      // O ID do seguro já é validado pelo ZodTypeProvider e tipado pelo schema da rota
      const { id } = req.params as InsuranceParamsSchema

      // 1. Verificar se o seguro existe
      const insurance = await prisma.insurance.findUnique({
        where: { id },
      })

      if (!insurance) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Insurance not found',
        })
      }

      // 2. Deletar o seguro
      await prisma.insurance.delete({
        where: { id },
      })

      // 204 No Content para deleção bem-sucedida
      return reply.status(204).send()
    } catch (error) {
      console.error('Error deleting insurance:', error)
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to delete insurance',
      })
    }
  }
}
