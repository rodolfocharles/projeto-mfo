// src/app.ts

import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

// --- Repositórios ---
import { PrismaAllocationsRepository } from './infrastructure/database/prisma/PrismaAllocationsRepository';
import { PrismaClientRepository } from './infrastructure/database/prisma/PrismaClientRepository';
import { PrismaMovementsRepository } from './infrastructure/database/prisma/PrismaMovementsRepository';
import { PrismaInsurancesRepository } from '@/infrastructure/database/prisma/PrismaInsurancesRepository'
import { PrismaSimulationsRepository } from '@/infrastructure/database/prisma/PrismaSimulationsRepository'
import { PrismaSnapshotsRepository } from '@/infrastructure/repositories/PrismaSnapshotsRepository'
import { PrismaAllocationSnapshotItemsRepository } from '@/infrastructure/database/prisma/PrismaAllocationSnapshotItemsRepository'
import { PrismaHistoriesRepository } from '@/infrastructure/database/prisma/PrismaHistoriesRepository'

// --- Serviços de infraestrutura ---
import { BcryptHashService } from './infrastructure/services/BcryptHashService';
import { ProjectionService } from './infrastructure/services/ProjectionService';
import { RealizedService } from './infrastructure/services/RealizedService'
import { IProjectionService } from './infrastructure/services/IProjectionService'
import { IRealizedService } from './infrastructure/services/IRealizedService'

// --- Casos de uso: Allocation ---
import { CreateAllocation } from './application/use-cases/CreateAllocation';
import { ListClientAllocations } from './application/use-cases/ListClientAllocations';
import { GetAllocationById } from './application/use-cases/GetAllocationById';
import { UpdateAllocation } from './application/use-cases/UpdateAllocation';
import { DeleteAllocation } from './application/use-cases/DeleteAllocation';

// --- Casos de uso: Client ---
import { CreateClient } from './application/use-cases/CreateClient';
import { UpdateClient } from './application/use-cases/UpdateClient';
import { GetClientById } from './application/use-cases/GetClientById';   // ← novo
import { ListClients } from './application/use-cases/ListClients';       // ← novo
import { DeleteClient } from './application/use-cases/DeleteClient';     // ← novo

// --- Casos de uso: Movement ---
import { CreateMovement } from './application/use-cases/CreateMovement';
import { ListClientMovements } from './application/use-cases/ListClientMovements';
import { GetMovementById } from './application/use-cases/GetMovementById';
import { UpdateMovement } from './application/use-cases/UpdateMovement';
import { DeleteMovement } from './application/use-cases/DeleteMovement';
import { ListMovementsByType } from './application/use-cases/ListMovementsByType';
import { GetMovementSummary } from './application/use-cases/GetMovementSummary';

// --- Casos de uso: Insurance ---
import { CreateInsurance } from '@/application/use-cases/CreateInsurance'
import { ListClientInsurances } from '@/application/use-cases/ListClientInsurances'
import { GetInsuranceById } from '@/application/use-cases/GetInsuranceById'
import { UpdateInsurance } from '@/application/use-cases/UpdateInsurance'
import { DeleteInsurance } from '@/application/use-cases/DeleteInsurance'

// --- Casos de uso: Simulation ---
import { CreateSimulation } from '@/application/use-cases/CreateSimulation'
import { ListClientSimulations } from '@/application/use-cases/ListClientSimulations'
import { GetSimulationById } from '@/application/use-cases/GetSimulationById'
import { UpdateSimulation } from '@/application/use-cases/UpdateSimulation'
import { DeleteSimulation } from '@/application/use-cases/DeleteSimulation'
import { CreateSimulationVersion } from '@/application/use-cases/CreateSimulationVersion'
import { GetProjection } from '@/application/use-cases/GetProjection'
import { CompareSimulations } from '@/application/use-cases/CompareSimulations'

// --- Casos de uso: AllocationSnapshot ---
import { CreateAllocationSnapshot } from '@/application/use-cases/CreateAllocationSnapshot'
import { GetAllocationSnapshotById } from '@/application/use-cases/GetAllocationSnapshotById'
import { ListClientAllocationSnapshots } from '@/application/use-cases/ListClientAllocationSnapshots'

// --- Casos de uso: History ---
import { ListSimulationVersionsByClient } from '@/application/use-cases/ListSimulationVersionsByClient'
import { ListLatestSimulationVersionsByClient } from '@/application/use-cases/ListLatestSimulationVersionsByClient'
import { ListRealizedPatrimonyByClient } from '@/application/use-cases/ListRealizedPatrimonyByClient'
import { GetSimulationVersionById } from '@/application/use-cases/GetSimulationVersionById'
//import { GetSimulationVersion } from '@/application/use-cases/GetSimulationVersion'
import { GetSimulationVersionWithLog } from '@/application/use-cases/decorators/GetSimulationVersionWithLog'

// --- Casos de uso: Snapshot ---
import { CreateSnapshot } from '@/application/use-cases/CreateSnapshot'
import { GetSnapshotById } from '@/application/use-cases/GetSnapshotById'
import { ListClientSnapshots } from '@/application/use-cases/ListClientSnapshots'
import { UpdateSnapshot } from '@/application/use-cases/UpdateSnapshot'
import { DeleteSnapshot } from '@/application/use-cases/DeleteSnapshot'

import { SnapshotController } from '@/infrastructure/http/controllers/SnapshotController'


// --- Controllers ---
import { AllocationController } from './infrastructure/http/controllers/AllocationController';
import { ClientController } from './infrastructure/http/controllers/ClientController';
import { MovementController } from './infrastructure/http/controllers/MovementController';
import { InsuranceController } from '@/infrastructure/http/controllers/InsuranceController';
import { SimulationController } from '@/infrastructure/http/controllers/SimulationController';
import { AllocationSnapshotController } from '@/infrastructure/http/controllers/AllocationSnapshotController';
import { HistoryController } from '@/infrastructure/http/controllers/HistoryController';import { AuthController } from './infrastructure/http/controllers/AuthController';

// --- Rotas DDD ---
import { allocationsRoutes } from './infrastructure/http/routes/allocations.routes';
import { clientsRoutes } from './infrastructure/http/routes/clients.routes';
import { movementsRoutes } from './infrastructure/http/routes/movements.routes';
import { insurancesRoutes } from '@/infrastructure/http/routes/insurances.routes';
import { simulationsRoutes } from '@/infrastructure/http/routes/simulations.routes';
import { allocationSnapshotRoutes } from '@/infrastructure/http/routes/allocation-snapshot.routes';
import { historyRoutes } from '@/infrastructure/http/routes/history.routes';
import { authRoutes } from './infrastructure/http/routes/auth.routes';
import { snapshotsRoutes } from '@/infrastructure/http/routes/snapshots.routes'

// --- Logger ---
import { ConsoleLogger } from './infrastructure/services/ConsoleLogger';

// --- Decorators (use cases com log) ---
import { CreateClientWithLog } from './application/use-cases/decorators/CreateClientWithLog';
import { UpdateClientWithLog } from './application/use-cases/decorators/UpdateClientWithLog';
import { GetClientByIdWithLog } from './application/use-cases/decorators/GetClientByIdWithLog';
import { ListClientsWithLog } from './application/use-cases/decorators/ListClientsWithLog';
import { DeleteClientWithLog } from './application/use-cases/decorators/DeleteClientWithLog';
import { CreateAllocationWithLog } from './application/use-cases/decorators/CreateAllocationWithLog';
import { ListClientAllocationsWithLog } from './application/use-cases/decorators/ListClientAllocationsWithLog';
import { CreateMovementWithLog } from './application/use-cases/decorators/CreateMovementWithLog';
import { ListClientMovementsWithLog } from './application/use-cases/decorators/ListClientMovementsWithLog';
import { GetMovementByIdWithLog } from './application/use-cases/decorators/GetMovementByIdWithLog';
import { UpdateMovementWithLog } from './application/use-cases/decorators/UpdateMovementWithLog';
import { DeleteMovementWithLog } from './application/use-cases/decorators/DeleteMovementWithLog';
import { CreateInsuranceWithLog } from '@/application/use-cases/decorators/CreateInsuranceWithLog'
import { ListClientInsurancesWithLog } from '@/application/use-cases/decorators/ListClientInsurancesWithLog'
import { GetInsuranceByIdWithLog } from '@/application/use-cases/decorators/GetInsuranceByIdWithLog'
import { UpdateInsuranceWithLog } from '@/application/use-cases/decorators/UpdateInsuranceWithLog'
import { DeleteInsuranceWithLog } from '@/application/use-cases/decorators/DeleteInsuranceWithLog'
import { DeleteAllocationWithLog } from './application/use-cases/decorators/DeleteAllocationWithLog';
import { UpdateAllocationWithLog } from './application/use-cases/decorators/UpdateAllocationWithLog';
import { GetAllocationByIdWithLog } from './application/use-cases/decorators/GetAllocationByIdWithLog';
import { ListMovementsByTypeWithLog } from './application/use-cases/decorators/ListMovementsByTypeWithLog';
import { GetMovementSummaryWithLog } from './application/use-cases/decorators/GetMovementSummaryWithLog';
import { CreateSimulationWithLog } from '@/application/use-cases/decorators/CreateSimulationWithLog'
import { ListClientSimulationsWithLog } from '@/application/use-cases/decorators/ListClientSimulationsWithLog'
import { GetSimulationByIdWithLog } from '@/application/use-cases/decorators/GetSimulationByIdWithLog'
import { UpdateSimulationWithLog } from '@/application/use-cases/decorators/UpdateSimulationWithLog'
import { DeleteSimulationWithLog } from '@/application/use-cases/decorators/DeleteSimulationWithLog'
import { CreateSimulationVersionWithLog } from '@/application/use-cases/decorators/CreateSimulationVersionWithLog'
import { GetProjectionWithLog } from '@/application/use-cases/decorators/GetProjectionWithLog'
import { CompareSimulationsWithLog } from '@/application/use-cases/decorators/CompareSimulationsWithLog'
import { CreateSnapshotWithLog } from '@/application/use-cases/decorators/CreateSnapshotWithLog'

// --- Decorators: AllocationSnapshot ---
import { CreateAllocationSnapshotWithLog } from '@/application/use-cases/decorators/CreateAllocationSnapshotWithLog'
import { GetAllocationSnapshotByIdWithLog } from '@/application/use-cases/decorators/GetAllocationSnapshotByIdWithLog'
import { ListClientAllocationSnapshotsWithLog } from '@/application/use-cases/decorators/ListClientAllocationSnapshotsWithLog'

// --- Decorators: History ---
import { ListSimulationVersionsByClientWithLog } from '@/application/use-cases/decorators/ListSimulationVersionsByClientWithLog'
import { ListLatestSimulationVersionsByClientWithLog } from '@/application/use-cases/decorators/ListLatestSimulationVersionsByClientWithLog'




export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(swagger, {
  openapi: {
    info: {
      title: 'MFO Backend API',
      version: '1.0.0',
    },
  },
});

app.register(swaggerUI, { routePrefix: '/docs' });

// configuração de CORS
app.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// ------------------------------------------------------------------
// JWT plugin
// ------------------------------------------------------------------
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'change_this_to_something_secure',
});

// decorador utilitário para proteger rotas
app.decorate('authenticate', async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});


app.get('/health', async () => ({ ok: true }));

// -------------------------------------------------------
// Injeção de Dependências
// -------------------------------------------------------
// +++++++++++++++++++++++++++++++++++++++
// casos de uso e controladores de autenticação
// +++++++++++++++++++++++++++++++++++++++
import { AuthenticateClient } from './application/use-cases/AuthenticateClient';
import { AuthController } from './infrastructure/http/controllers/AuthController';
import { PrismaAllocationSnapshotsRepository } from './infrastructure/repositories/PrismaAllocationSnapshotsRepository';


// 0. Logger
const logger = new ConsoleLogger();

// 1. Serviços
const hashService = new BcryptHashService();

// 2. Repositórios
const allocationsRepository = new PrismaAllocationsRepository();
const clientRepository = new PrismaClientRepository();
const movementsRepository = new PrismaMovementsRepository()
const insurancesRepository = new PrismaInsurancesRepository()
const simulationsRepository = new PrismaSimulationsRepository()
const snapshotsRepository = new PrismaSnapshotsRepository() // ← Certifique-se que está aqui
const allocationSnapshotItemsRepository = new PrismaAllocationSnapshotItemsRepository() // ← Certifique-se que está aqui
const allocationSnapshotsRepository = new PrismaAllocationSnapshotsRepository()
const historiesRepository = new PrismaHistoriesRepository()
const projectionService = new ProjectionService(movementsRepository, insurancesRepository, snapshotsRepository, clientRepository, simulationsRepository)

// 2.1. use-case específico de autenticação
const authenticateClientBase = new AuthenticateClient(clientRepository, hashService);
const authController = new AuthController(authenticateClientBase);

// 3. Casos de uso: Allocation (base, sem log)
const createAllocationBase = new CreateAllocation(allocationsRepository, clientRepository);
const listClientAllocationsBase = new ListClientAllocations(allocationsRepository, clientRepository);
const getAllocationByIdBase = new GetAllocationById(allocationsRepository);
const updateAllocationBase = new UpdateAllocation(allocationsRepository);
const deleteAllocationBase = new DeleteAllocation(allocationsRepository);

// 3.1. Casos de uso: Allocation (decorados, com log)
const createAllocationUseCase = new CreateAllocationWithLog(createAllocationBase, logger);
const listClientAllocationsUseCase = new ListClientAllocationsWithLog(listClientAllocationsBase, logger);
const getAllocationByIdUseCase = new GetAllocationByIdWithLog(getAllocationByIdBase, logger);
const updateAllocationUseCase = new UpdateAllocationWithLog(updateAllocationBase, logger);
const deleteAllocationUseCase = new DeleteAllocationWithLog(deleteAllocationBase, logger);

// 4. Casos de uso: Client (base, sem log)
const createClientBase = new CreateClient(clientRepository, hashService);
const updateClientBase = new UpdateClient(clientRepository);
const getClientByIdBase = new GetClientById(clientRepository);
const listClientsBase = new ListClients(clientRepository);
const deleteClientBase = new DeleteClient(clientRepository);

// 4.1. Casos de uso: Client (decorados, com log)
const createClientUseCase = new CreateClientWithLog(createClientBase, logger);
const updateClientUseCase = new UpdateClientWithLog(updateClientBase, logger);
const getClientByIdUseCase = new GetClientByIdWithLog(getClientByIdBase, logger);
const listClientsUseCase = new ListClientsWithLog(listClientsBase, logger);
const deleteClientUseCase = new DeleteClientWithLog(deleteClientBase, logger);

// 5. Casos de uso: Movement (base, sem log)
const createMovementBase = new CreateMovement(movementsRepository, clientRepository)
const listClientMovementsBase = new ListClientMovements(movementsRepository, clientRepository)
const getMovementByIdBase = new GetMovementById(movementsRepository)
const updateMovementBase = new UpdateMovement(movementsRepository)
const deleteMovementBase = new DeleteMovement(movementsRepository)
const getMovementSummaryBase = new GetMovementSummary(movementsRepository, clientRepository)
const listMovementsByTypeBase = new ListMovementsByType(movementsRepository, clientRepository)

// 5.1. Casos de uso: Movement (decorados, com log)
const createMovementUseCase = new CreateMovementWithLog(createMovementBase, logger)
const listClientMovementsUseCase = new ListClientMovementsWithLog(listClientMovementsBase, logger)
const getMovementByIdUseCase = new GetMovementByIdWithLog(getMovementByIdBase, logger)
const updateMovementUseCase = new UpdateMovementWithLog(updateMovementBase, logger)
const deleteMovementUseCase = new DeleteMovementWithLog(deleteMovementBase, logger)
const getMovementSummaryUseCase = new GetMovementSummaryWithLog(getMovementSummaryBase, logger)
const listMovementsByTypeUseCase = new ListMovementsByTypeWithLog(listMovementsByTypeBase, logger)

// 6. Casos de uso: Insurance (base, sem log)
const createInsuranceBase = new CreateInsurance(insurancesRepository, clientRepository)
const listClientInsurancesBase = new ListClientInsurances(insurancesRepository, clientRepository)
const getInsuranceByIdBase = new GetInsuranceById(insurancesRepository)
const updateInsuranceBase = new UpdateInsurance(insurancesRepository)
const deleteInsuranceBase = new DeleteInsurance(insurancesRepository)

// 6.1. Casos de uso: Insurance (decorados, com log)
const createInsuranceUseCase = new CreateInsuranceWithLog(createInsuranceBase, logger)
const listClientInsurancesUseCase = new ListClientInsurancesWithLog(listClientInsurancesBase, logger)
const getInsuranceByIdUseCase = new GetInsuranceByIdWithLog(getInsuranceByIdBase, logger)
const updateInsuranceUseCase = new UpdateInsuranceWithLog(updateInsuranceBase, logger)
const deleteInsuranceUseCase = new DeleteInsuranceWithLog(deleteInsuranceBase, logger)

// 7. Casos de uso: Simulation (base, sem log)
const createSimulationBase = new CreateSimulation(simulationsRepository, clientRepository)
const listClientSimulationsBase = new ListClientSimulations(simulationsRepository, clientRepository)
const getSimulationByIdBase = new GetSimulationById(simulationsRepository)
const updateSimulationBase = new UpdateSimulation(simulationsRepository)
const deleteSimulationBase = new DeleteSimulation(simulationsRepository)
const createSimulationVersionBase = new CreateSimulationVersion(simulationsRepository)
const getProjectionBase = new GetProjection(simulationsRepository, projectionService)
const compareSimulationsBase = new CompareSimulations(simulationsRepository, projectionService)

// 7.1. Casos de uso: Simulation (decorados, com log)
const createSimulationUseCase = new CreateSimulationWithLog(createSimulationBase, logger)
const listClientSimulationsUseCase = new ListClientSimulationsWithLog(listClientSimulationsBase, logger)
const getSimulationByIdUseCase = new GetSimulationByIdWithLog(getSimulationByIdBase, logger)
const updateSimulationUseCase = new UpdateSimulationWithLog(updateSimulationBase, logger)
const deleteSimulationUseCase = new DeleteSimulationWithLog(deleteSimulationBase, logger)
const createSimulationVersionUseCase = new CreateSimulationVersionWithLog(createSimulationVersionBase, logger)
const getProjectionUseCase = new GetProjectionWithLog(getProjectionBase, logger)
const compareSimulationsUseCase = new CompareSimulationsWithLog(compareSimulationsBase, logger)

// 8. Casos de uso: AllocationSnapshot (base, sem log)
const createAllocationSnapshotBase = new CreateAllocationSnapshot(allocationsRepository, allocationSnapshotItemsRepository, allocationsRepository, clientRepository)
const getAllocationSnapshotByIdBase = new GetAllocationSnapshotById(allocationSnapshotsRepository, allocationSnapshotItemsRepository)
const listClientAllocationSnapshotsBase = new ListClientAllocationSnapshots(allocationSnapshotsRepository)

// 8.1. Casos de uso: AllocationSnapshot (decorados, com log)
const createAllocationSnapshotUseCase = new CreateAllocationSnapshotWithLog(createAllocationSnapshotBase, logger)
const getAllocationSnapshotByIdUseCase = new GetAllocationSnapshotByIdWithLog(getAllocationSnapshotByIdBase, logger)
const listClientAllocationSnapshotsUseCase = new ListClientAllocationSnapshotsWithLog(listClientAllocationSnapshotsBase, logger)

// 9. Casos de uso: History (base, sem log)
const listSimulationVersionsByClientBase = new ListSimulationVersionsByClient(historiesRepository)
const listLatestSimulationVersionsByClientBase = new ListLatestSimulationVersionsByClient(historiesRepository)
const listRealizedPatrimonyByClientBase = new ListRealizedPatrimonyByClient(
  allocationSnapshotsRepository,
  allocationSnapshotItemsRepository,
  clientRepository,
)


// 9.1. Casos de uso: History (decorados, com log)
const listSimulationVersionsByClientUseCase = new ListSimulationVersionsByClientWithLog(listSimulationVersionsByClientBase, logger)
const listLatestSimulationVersionsByClientUseCase = new ListLatestSimulationVersionsByClientWithLog(
  listLatestSimulationVersionsByClientBase,
  logger,
)
const listRealizedPatrimonyByClientUseCase = listRealizedPatrimonyByClientBase
const getSimulationVersionBase = new GetSimulationVersionById(historiesRepository)
const getSimulationVersionUseCase = new GetSimulationVersionWithLog(getSimulationVersionBase, logger)


// 10. Casos de uso: Snapshot (base, sem log)
const createSnapshotBase = new CreateSnapshot(snapshotsRepository, clientRepository)
const getSnapshotByIdBase = new GetSnapshotById(snapshotsRepository)
const listClientSnapshotsBase = new ListClientSnapshots(snapshotsRepository, clientRepository)
const updateSnapshotBase = new UpdateSnapshot(snapshotsRepository)
const deleteSnapshotBase = new DeleteSnapshot(snapshotsRepository)

// 10.1. Casos de uso: Snapshot (decorados, com log)
const createSnapshotUseCase = new CreateSnapshotWithLog(createSnapshotBase, logger)

// 11. Controllers
const allocationController = new AllocationController(
  createAllocationUseCase,
  listClientAllocationsUseCase,
  getAllocationByIdUseCase,
  updateAllocationUseCase,
  deleteAllocationUseCase,
  logger,
);

const clientController = new ClientController(
  createClientUseCase,   // ← removido clientRepository do construtor
  updateClientUseCase,
  getClientByIdUseCase,  // ← novo
  listClientsUseCase,    // ← novo
  deleteClientUseCase,   // ← novo
);

const movementController = new MovementController(
  createMovementUseCase,
  listClientMovementsUseCase,
  getMovementByIdUseCase,
  updateMovementUseCase,
  deleteMovementUseCase,
  getMovementSummaryUseCase,
  listMovementsByTypeUseCase,
)

const insuranceController = new InsuranceController(
  createInsuranceUseCase,
  listClientInsurancesUseCase,
  getInsuranceByIdUseCase,
  updateInsuranceUseCase,
  deleteInsuranceUseCase,
)

const simulationController = new SimulationController(
  createSimulationUseCase,
  listClientSimulationsUseCase,
  getSimulationByIdUseCase,
  updateSimulationUseCase,
  deleteSimulationUseCase,
  createSimulationVersionUseCase,
  getProjectionUseCase,
  compareSimulationsUseCase,
)

const allocationSnapshotController = new AllocationSnapshotController(
  createAllocationSnapshotUseCase,
  getAllocationSnapshotByIdUseCase,
  listClientAllocationSnapshotsUseCase,
  logger,
)

const historyController = new HistoryController(
  listSimulationVersionsByClientUseCase,
  listLatestSimulationVersionsByClientUseCase,
  getSimulationVersionUseCase,
  listRealizedPatrimonyByClientUseCase,
  logger,
)

const snapshotController = new SnapshotController(
  createSnapshotUseCase,
  getSnapshotByIdBase,
  listClientSnapshotsBase,
  updateSnapshotBase,
  deleteSnapshotBase,
  logger,
)

// -------------------------------------------------------
// Rotas DDD
// -------------------------------------------------------
// ------------------------------------------------------------------
// roteamento e proteção de endpoints
// ------------------------------------------------------------------



// global hook que exige token em todas as rotas que vierem depois do
// login; liberamos explicitamente POST /api/clients (registro) e
// POST /api/auth/login
app.addHook('preHandler', async (req, reply) => {
  const openPaths: Array<{method: string; path: string}> = [
    { method: 'POST', path: '/api/auth/login' },
    { method: 'POST', path: '/api/clients' },
    { method: 'POST', path: '/api/snapshots' },      // ← Adicione esta linha
    { method: 'GET', path: '/api/snapshots' },       // ← E esta também
    { method: 'PUT', path: '/api/snapshots' },       // ← E esta
    { method: 'DELETE', path: '/api/snapshots' },
  ];

  // rota corrente (com prefixo) e método
  const matching = openPaths.find(
    (p) => p.method === req.method && req.url === p.path,
  );
  if (matching) {
    return;
  }
  await (app as any).authenticate(req, reply);
});

// agora registramos as demais rotas conhecendo que o hook acima irá
// verificá‑las
app.register(async (fastifyInstance) => {
  // routes importadas abaixo
  await allocationsRoutes(fastifyInstance, allocationController);
  await clientsRoutes(fastifyInstance, clientController);
  await movementsRoutes(fastifyInstance, movementController);
  await insurancesRoutes(fastifyInstance, insuranceController);
  await simulationsRoutes(fastifyInstance, simulationController);
  await allocationSnapshotRoutes(fastifyInstance, allocationSnapshotController);
  await snapshotsRoutes(fastifyInstance, snapshotController);
  await historyRoutes(fastifyInstance, historyController);
  // adição de authRoutes também dentro do mesmo grupo, mas já foi aberto
  // pelo hook; fica seguro registrar aqui após definição de controller
  await authRoutes(fastifyInstance, authController);
}, { prefix: '/api' });

// -------------------------------------------------------
// Rotas legadas
// -------------------------------------------------------
//app.register(simulationRoutes, { prefix: '/api' });
//app.register(allocationSnapshotRoutes, { prefix: '/api' });
//app.register(movementRoutes, { prefix: '/api' });
//app.register(insuranceRoutes, { prefix: '/api' });
//app.register(historyRoutes, { prefix: '/api' });

app.setErrorHandler((error, req, reply) => {
  console.error(error);
  reply.status(500).send({ error: (error as Error).message });
});