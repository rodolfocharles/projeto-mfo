/*
  Warnings:

  - You are about to drop the column `financing` on the `allocations` table. All the data in the column will be lost.
  - You are about to drop the column `isFinanced` on the `allocations` table. All the data in the column will be lost.
  - You are about to drop the column `snapshotId` on the `allocations` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `allocations` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `allocations` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "allocations" DROP CONSTRAINT "allocations_snapshotId_fkey";

-- AlterTable
ALTER TABLE "allocations" DROP COLUMN "financing",
DROP COLUMN "isFinanced",
DROP COLUMN "snapshotId",
DROP COLUMN "type",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "contribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isTaxable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "insurances" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "projection_results" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "snapshots" ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "allocation_snapshots" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "allocationId" TEXT NOT NULL,
    "valueAtSnapshot" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "allocation_snapshots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocation_snapshots" ADD CONSTRAINT "allocation_snapshots_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocation_snapshots" ADD CONSTRAINT "allocation_snapshots_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "allocations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
