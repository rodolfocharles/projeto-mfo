// src/infrastructure/repositories/repositories.module.ts
import { Module } from '@nestjs/common'
import { PrismaAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository'
import { IAllocationSnapshotsRepository } from '@/domain/repositories/IAllocationSnapshotsRepository'

@Module({
  providers: [
    {
      provide: IAllocationSnapshotsRepository,
      useClass: PrismaAllocationSnapshotsRepository,
    },
  ],
  exports: [IAllocationSnapshotsRepository],
})
export class RepositoriesModule {}