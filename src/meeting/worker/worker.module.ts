import { Module } from '@nestjs/common';
import { WorkerService } from './services/worker.service';

@Module({
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
