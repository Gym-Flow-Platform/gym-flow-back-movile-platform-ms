import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthHttpController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  check() {
    return this.healthCheckService.check([
      () => this.http.pingCheck('google', 'https://google.com'),
    ]);
  }

  @Get('api-working')
  apiWorking() {
    return { message: 'API Working' };
  }
}
