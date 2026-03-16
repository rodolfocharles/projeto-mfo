// src/application/dtos/AllocationDTO.ts
import { z } from 'zod';
import {
  CreateAllocationSchema,
  UpdateAllocationSchema,
  AllocationResponseSchema,
  AllocationListResponseSchema,
  InternalAllocationResponseSchema, 
} from '@/schemas/allocation.schema';

// Inputs
export type CreateAllocationInput       = z.infer<typeof CreateAllocationSchema>;
export type UpdateAllocationInput       = z.infer<typeof UpdateAllocationSchema>;
export type GetAllocationByIdInput      = { allocationId: string };
export type DeleteAllocationInput       = { allocationId: string };
export type ListClientAllocationsInput  = { clientId: string };

// Outputs
export type AllocationResponse          = z.infer<typeof AllocationResponseSchema>;
export type AllocationListResponse      = z.infer<typeof AllocationListResponseSchema>;
export type AllocationInternalResponse = z.infer<typeof InternalAllocationResponseSchema>;