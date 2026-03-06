// src/application/dtos/HistoryDTO.ts
import { z } from 'zod';
import {
  ClientParamsSchema,
  SimulationParamsSchema,
  SimulationHistoryResponseSchema,
} from '@/schemas/history.schema';

// Inputs
export type ListSimulationVersionsByClientInput = z.infer<typeof ClientParamsSchema>;
export type GetSimulationVersionInput = z.infer<typeof SimulationParamsSchema>;

// Outputs
export type SimulationHistoryResponse = z.infer<typeof SimulationHistoryResponseSchema>;
export type SimulationHistoryListResponse = z.infer<typeof SimulationHistoryResponseSchema>[];