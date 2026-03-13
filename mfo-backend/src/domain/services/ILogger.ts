// src/domain/services/ILogger.ts

export interface ILogger {
  log(message: string, data?: any): void
  error(message: string, error?: any): void
  warn(message: string, data?: any): void
  debug(message: string, data?: any): void
}