// src/infrastructure/services/BcryptHashService.ts
import bcrypt from 'bcrypt';
import { IHashService } from '@/domain/services/IHashService';

export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}