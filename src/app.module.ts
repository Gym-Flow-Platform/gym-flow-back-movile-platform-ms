import { Module } from '@nestjs/common';
import { HealthHttpController } from './health.controller';

@Module({
  imports: [],
  controllers: [HealthHttpController],
  providers: [],
})
export class AppModule {}
