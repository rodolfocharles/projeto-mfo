-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "realRate" DOUBLE PRECISION NOT NULL,
    "inflation" DOUBLE PRECISION NOT NULL,
    "lifeStatus" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allocations" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "isFinanced" BOOLEAN NOT NULL DEFAULT false,
    "financing" JSONB,

    CONSTRAINT "allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movements" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isRecurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurances" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "monthlyPremium" DOUBLE PRECISION NOT NULL,
    "insuredAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projection_results" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "financial" DOUBLE PRECISION NOT NULL,
    "immobilized" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "totalNoIns" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "projection_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "simulations_clientId_name_version_key" ON "simulations"("clientId", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "projection_results_simulationId_period_key" ON "projection_results"("simulationId", "period");

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements" ADD CONSTRAINT "movements_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projection_results" ADD CONSTRAINT "projection_results_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
