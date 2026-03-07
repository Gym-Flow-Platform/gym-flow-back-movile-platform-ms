import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthHttpController } from './health.controller';

describe('HealthHttpController', () => {
  let controller: HealthHttpController;
  let healthCheckService: HealthCheckService;
  let http: HttpHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthHttpController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthHttpController>(HealthHttpController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    http = module.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should call healthCheckService.check with google ping check', async () => {
      const checkSpy = jest.spyOn(healthCheckService, 'check');
      const pingCheckSpy = jest.spyOn(http, 'pingCheck');

      await controller.check();

      expect(checkSpy).toHaveBeenCalledWith([expect.any(Function)]);

      // Execute the function passed to check to verify pingCheck call
      const checkArg = checkSpy.mock.calls[0][0][0];
      await checkArg();

      expect(pingCheckSpy).toHaveBeenCalledWith('google', 'https://google.com');
    });
  });

  describe('apiWorking', () => {
    it('should return API Working message', () => {
      const result = controller.apiWorking();
      expect(result).toEqual({ message: 'API Working' });
    });
  });
});
