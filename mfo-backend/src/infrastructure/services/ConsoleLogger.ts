// src/infrastructure/services/ConsoleLogger.ts

import { ILogger } from '../../domain/services/ILogger';

export class ConsoleLogger implements ILogger {
  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} — ${message}`);
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${new Date().toISOString()} — ${message}`, error ?? '');
  }
}