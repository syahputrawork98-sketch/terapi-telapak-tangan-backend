import { Controller, Get } from '@nestjs/common';
import { success } from '../common/utils/envelope';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return success('OK', { status: 'up' });
  }
}