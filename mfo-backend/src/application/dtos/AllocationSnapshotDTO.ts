// src/application/dtos/AllocationSnapshotDTO.ts
import { z } from 'zod';
import {
  CreateAllocationSnapshotSchema,
  UpdateAllocationSnapshotItemSchema,
  SnapshotResponseSchema,
  FullSnapshotResponseSchema,
  AllocationSnapshotItemResponseSchema,
} from '@/schemas/allocation-snapshot.schema';

// Inputs
export type CreateAllocationSnapshotInput = z.infer<typeof CreateAllocationSnapshotSchema>;
export type UpdateAllocationSnapshotItemInput = z.infer<typeof UpdateAllocationSnapshotItemSchema>;
export type GetAllocationSnapshotByIdInput = { snapshotId: string };
export type DeleteAllocationSnapshotInput = { snapshotId: string };
export type ListClientAllocationSnapshotsInput = { clientId: string };

// Outputs
export type AllocationSnapshotResponse = z.infer<typeof SnapshotResponseSchema>;
export type FullAllocationSnapshotResponse = z.infer<typeof FullSnapshotResponseSchema>;
export type AllocationSnapshotItemResponse = z.infer<typeof AllocationSnapshotItemResponseSchema>;