/*
  Warnings:

  - You are about to drop the `insurances` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('LIFE', 'DISABILITY');

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_clientId_fkey";

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'temp_password_hash';

-- DropTable
DROP TABLE "insurances";

-- CreateTable
CREATE TABLE "Insurance" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InsuranceType" NOT NULL,
    "coverage" DOUBLE PRECISION NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insurance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
