// src/application/use-cases/helpers/allocationToResponse.ts

import { Allocation } from '@/domain/entities/Allocation';
import { AllocationInternalResponse } from '@/application/dtos/AllocationDTO';

export function allocationToResponse(a: Allocation): AllocationInternalResponse {
  return {
    id: a.id,
    clientId: a.clientId,
    snapshotId: a.snapshotId ?? null,
    name: a.name,
    type: a.type,
    value: a.value,
    startDate: a.startDate,       // ← Date, não ISO string
    contribution: a.contribution,
    rate: a.rate,
    isTaxable: a.isTaxable,
    isFinanced: a.isFinanced,
    downPayment: a.downPayment ?? null,
    installments: a.installments ?? null,
    interestRate: a.interestRate ?? null,
    createdAt: a.createdAt,       // ← Date, não ISO string
    updatedAt: a.updatedAt ?? null,
  };
}