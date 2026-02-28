import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SlotsModule } from './slots/slots.module';
import { BookingsModule } from './bookings/bookings.module';
import { SuperAdminModule } from './super-admin/super-admin.module';

@Module({
  imports: [AuthModule, HealthModule, SlotsModule, BookingsModule, SuperAdminModule],
})
export class AppModule {}
