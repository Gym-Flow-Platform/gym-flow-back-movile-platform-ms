import { Module } from '@nestjs/common';
import { HealthHttpController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthHttpController],
  providers: [],
})
export class AppModule {}
