-- CreateEnum
CREATE TYPE "AllocationType" AS ENUM ('FINANCIAL', 'IMMOBILIZED');

-- AlterTable
ALTER TABLE "allocations" ADD COLUMN     "type" "AllocationType" NOT NULL DEFAULT 'FINANCIAL';
