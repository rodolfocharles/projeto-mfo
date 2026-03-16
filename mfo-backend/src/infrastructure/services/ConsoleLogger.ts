// src/infrastructure/services/ConsoleLogger.ts

import { ILogger } from '../../domain/services/ILogger';

export class ConsoleLogger implements ILogger {
  log(message: string, data?: any): void {
    console.log(`[LOG] ${message}`, data || '')
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '')
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || '')
  }

  debug(message: string, data?: any): void {
    console.debug(`[DEBUG] ${message}`, data || '')
  }
}