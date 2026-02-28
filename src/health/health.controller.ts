import { Controller, Get } from '@nestjs/common';
import { success } from '../common/utils/envelope';

@Controller()
export class HealthController {
  @Get()
  root() {
    return success('Terapi Telapak Tangan Backend', {
      service: 'api',
      status: 'up',
      health_path: '/health',
    });
  }

  @Get('health')
  health() {
    return success('OK', { status: 'up' });
  }
}