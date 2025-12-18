import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { clientRoutes } from './routes/clients'
import { simulationRoutes } from './routes/simulations'
import { allocationRoutes } from './routes/allocations'
import { allocationSnapshotRoutes } from './routes/allocation-snapshots'
import { movementRoutes } from './routes/movements'
import { insuranceRoutes } from './routes/insurances'
import { historyRoutes } from './routes/history'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

//SWAGGER MINIMALISTA
app.register(swagger, {
  openapi: {
    info: {
      title: 'MFO Backend API',
      version: '1.0.0',
    },
  },
})

app.register(swaggerUI, {
  routePrefix: '/docs',
})

//Configure o CORS para permitir PUT e DELETE
app.register(cors, {
  origin: 'http://localhost:3001', // Ou '*' para permitir de qualquer origem (menos seguro em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Adicione PUT e DELETE aqui
  allowedHeaders: ['Content-Type', 'Authorization'], // Adicione outros headers se necessário
  credentials: true, // Se você estiver usando cookies ou cabeçalhos de autorização
});

app.get('/health', async () => ({ ok: true }))

// Registrar rotas
app.register(clientRoutes, { prefix: '/api' })
app.register(simulationRoutes, { prefix: '/api' })
app.register(allocationRoutes, { prefix: '/api' })
app.register(allocationSnapshotRoutes, { prefix: '/api' })
app.register(movementRoutes, { prefix: '/api' })
app.register(insuranceRoutes, { prefix: '/api' })
app.register(historyRoutes, { prefix: '/api' })

app.setErrorHandler((error, req, reply) => {
  console.error(error)
  reply.status(500).send({ error: error.message })
})
