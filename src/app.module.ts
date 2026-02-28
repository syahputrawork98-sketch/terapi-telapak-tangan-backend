import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SlotsModule } from './slots/slots.module';

@Module({
  imports: [AuthModule, HealthModule, SlotsModule],
})
export class AppModule {}